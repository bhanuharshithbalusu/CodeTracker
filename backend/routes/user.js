const express = require('express');
const User = require('../models/User'); // Add this import
const {
  getProfile,
  updatePlatforms,
  getUserStats,
  refreshUserStats,
  deleteAccount,
  updatePlatformsValidation
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/platforms', updatePlatformsValidation, updatePlatforms);
router.get('/stats', getUserStats);
router.post('/refresh-stats', refreshUserStats);
router.delete('/account', deleteAccount);

module.exports = router;
