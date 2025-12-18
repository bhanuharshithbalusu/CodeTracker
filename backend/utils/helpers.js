const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_EXPIRE) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        platforms: user.platforms,
        createdAt: user.createdAt
      }
    });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (next && typeof next === 'function') {
      next(err);
    } else {
      console.error('AsyncHandler error:', err);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  });
};

const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : user;
  delete userObj.password;
  return userObj;
};

const formatError = (error) => {
  let message = error.message || 'Server Error';
  let statusCode = 500;

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    message = Object.values(error.errors).map(err => err.message).join(', ');
    statusCode = 400;
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    message = 'Email already exists';
    statusCode = 400;
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400;
  }

  return { message, statusCode };
};

const getClientIP = (req) => {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.headers['x-forwarded-for']?.split(',')[0] ||
         'unknown';
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  generateToken,
  sendTokenResponse,
  asyncHandler,
  validateEmail,
  validatePassword,
  sanitizeUser,
  formatError,
  getClientIP,
  sleep
};
