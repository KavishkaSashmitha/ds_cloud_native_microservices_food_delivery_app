// services/authService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const config = require('../config/config');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role,
      email: user.email
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );
};

/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: config.REFRESH_TOKEN_EXPIRY }
  );
};

/**
 * Register a new user
 * @param {Object} userData - User data
 * @returns {Object} User object and tokens
 */
const registerUser = async (userData) => {
  const { username, email, password, role, profile } = userData;
  
  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error('User already exists with this email or username');
  }
  
  // Create user
  const user = await User.create({
    username,
    email,
    password,
    role: role || 'CUSTOMER',
    profile
  });
  
  // Generate tokens
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();
  
  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile
    },
    token,
    refreshToken
  };
};

/**
 * Login user
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User object and tokens
 */
const loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }
  
  // Update last login
  user.lastLogin = Date.now();
  
  // Generate tokens
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();
  
  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile
    },
    token,
    refreshToken
  };
};

/**
 * Refresh token
 * @param {String} refreshToken - Refresh token
 * @returns {Object} New access token
 */
const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }
  
  // Verify refresh token
  const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET);
  
  // Find user by id and refresh token
  const user = await User.findOne({ 
    _id: decoded.id,
    refreshToken 
  });
  
  if (!user) {
    throw new Error('Invalid refresh token');
  }
  
  // Generate new access token
  const token = generateToken(user);
  
  return { token };
};

/**
 * Logout user
 * @param {String} userId - User ID
 */
const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
  return true;
};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser
};