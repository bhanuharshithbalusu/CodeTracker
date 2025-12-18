const User = require('../models/User');
const UserStats = require('../models/UserStats');
const statsAggregatorService = require('../services/statsAggregatorService');
const { body, validationResult } = require('express-validator');
const { asyncHandler, formatError } = require('../utils/helpers');

// @desc    Get user profile with platforms
// @route   GET /api/user/profile
// @access  Private
const getProfile = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get user stats summary
    const stats = await statsAggregatorService.getUserStats(req.user._id);
    
    res.status(200).json({
      success: true,
      user,
      stats: stats.aggregated,
      lastUpdated: stats.lastUpdated
    });
  } catch (error) {
    console.error('Get profile error:', error);
    const { message, statusCode } = formatError(error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

// @desc    Update platform usernames
// @route   PUT /api/user/platforms
// @access  Private
const updatePlatforms = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    const { platforms } = req.body;
    
    // Validate platform usernames format (basic validation)
    const validPlatforms = ['leetcode', 'codeforces', 'codechef', 'w3schools'];
    const updateData = {};
    
    for (const [platform, username] of Object.entries(platforms)) {
      if (validPlatforms.includes(platform)) {
        updateData[`platforms.${platform}`] = username.trim();
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Clean up stats for removed platforms and get active platforms
    const cleanupResult = await statsAggregatorService.cleanupRemovedPlatforms(req.user._id, user.platforms);
    console.log(`Cleanup result for user ${req.user._id}:`, cleanupResult);

    // After cleaning up, fetch new stats for the active platforms
    const nonEmptyPlatforms = {};
    Object.entries(user.platforms).forEach(([key, value]) => {
      if (value && value.trim()) {
        nonEmptyPlatforms[key] = value.trim();
      }
    });

    if (Object.keys(nonEmptyPlatforms).length > 0) {
      // Fetch stats in background (don't wait for completion)
      statsAggregatorService.fetchAllUserStats(req.user._id, nonEmptyPlatforms)
        .then(results => {
          console.log(`Stats updated for user ${req.user._id}:`, results);
        })
        .catch(error => {
          console.error(`Background stats update failed for user ${req.user._id}:`, error);
        });
    }

    res.status(200).json({
      success: true,
      message: 'Platform usernames updated successfully',
      user,
      note: 'Statistics will be updated in the background'
    });
  } catch (error) {
    console.error('Update platforms error:', error);
    const { message, statusCode } = formatError(error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

// @desc    Get user statistics from all platforms
// @route   GET /api/user/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res, next) => {
  try {
    const stats = await statsAggregatorService.getUserStats(req.user._id);
    
    res.status(200).json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    const { message, statusCode } = formatError(error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

// @desc    Refresh user statistics
// @route   POST /api/user/refresh-stats
// @access  Private
const refreshUserStats = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get non-empty platforms
    const platforms = {};
    Object.entries(user.platforms).forEach(([key, value]) => {
      if (value && value.trim()) {
        platforms[key] = value.trim();
      }
    });

    if (Object.keys(platforms).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No platform usernames configured. Please add platform usernames in your profile.'
      });
    }

    const results = await statsAggregatorService.refreshUserStats(req.user._id, platforms);
    
    res.status(200).json({
      success: true,
      message: 'Statistics refreshed successfully',
      results
    });
  } catch (error) {
    console.error('Refresh stats error:', error);
    const { message, statusCode } = formatError(error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res, next) => {
  try {
    const { confirmDelete } = req.body;
    
    if (confirmDelete !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Please confirm account deletion by sending "DELETE" in confirmDelete field'
      });
    }

    // Soft delete - deactivate user and mark stats as inactive
    await User.findByIdAndUpdate(req.user._id, { isActive: false });
    await UserStats.updateMany(
      { userId: req.user._id },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: 'Account has been deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    const { message, statusCode } = formatError(error);
    res.status(statusCode).json({
      success: false,
      message
    });
  }
});

// Validation middleware
const updatePlatformsValidation = [
  body('platforms')
    .isObject()
    .withMessage('Platforms must be an object'),
  body('platforms.leetcode')
    .optional()
    .isLength({ max: 50 })
    .withMessage('LeetCode username cannot exceed 50 characters')
    .trim(),
  body('platforms.codeforces')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Codeforces username cannot exceed 50 characters')
    .trim(),
  body('platforms.codechef')
    .optional()
    .isLength({ max: 50 })
    .withMessage('CodeChef username cannot exceed 50 characters')
    .trim(),
  body('platforms.w3schools')
    .optional()
    .isLength({ max: 50 })
    .withMessage('W3Schools username cannot exceed 50 characters')
    .trim()
];

module.exports = {
  getProfile,
  updatePlatforms,
  getUserStats,
  refreshUserStats,
  deleteAccount,
  updatePlatformsValidation
};
