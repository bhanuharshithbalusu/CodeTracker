const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// GET /api/user/me — Get current user profile (protected)
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/user/profile — Update user profile
router.put('/profile', auth, [
    body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.name) user.name = req.body.name;
        await user.save();

        const safeUser = user.toJSON();
        delete safeUser.password;
        res.json(safeUser);
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/user/password — Change password
router.put('/password', auth, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
