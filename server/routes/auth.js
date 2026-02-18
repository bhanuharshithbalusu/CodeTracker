const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Validation rules
const registerRules = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginRules = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// POST /api/auth/register
router.post('/register', registerRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashedPassword, authProvider: 'local' });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login
router.post('/login', loginRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If user signed up via Google and has no password
        if (user.authProvider === 'google' && !user.password) {
            return res.status(401).json({ message: 'This account uses Google Sign-In. Please use the Google button to log in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        // Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;

        if (!email) {
            return res.status(400).json({ message: 'Could not get email from Google account' });
        }

        // Find existing user by googleId or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Link Google ID if user exists with email but no googleId
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = user.password ? user.authProvider : 'google';
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name: name || email.split('@')[0],
                email,
                googleId,
                authProvider: 'google',
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error('Google auth error:', err);
        res.status(401).json({ message: 'Google authentication failed' });
    }
});

module.exports = router;
