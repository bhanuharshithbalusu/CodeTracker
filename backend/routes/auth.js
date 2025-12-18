const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout,
  googleCallback,
  googleSuccess,
  registerValidation,
  loginValidation,
  updateDetailsValidation
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5177'}/login?error=oauth_failed`
  }),
  googleCallback
);

router.get('/google/success', googleSuccess);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetailsValidation, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
