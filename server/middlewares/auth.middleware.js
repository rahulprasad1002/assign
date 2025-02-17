import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config/env.js';
import { generateTokens } from '../lib/token.js';

// Middleware to Authenticate JWT
export const authenticate = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken; // Extract Access Token
  const refreshToken = req.cookies?.refreshToken; // Extract Refresh Token from Cookies

  if (!accessToken) return res.status(401).json({ message: 'Access Denied' });

  try {
    // Verify Access Token
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);

    // Fetch Latest User Data from DB
    const user = await User.findById(decoded.id).select(
      '-password -refreshTokens'
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // Now always using latest user data

    return next();
  } catch (error) {
    // If expired, check for Refresh Token
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN);
        const user = await User.findById(decoded.id);

        // Ensure refresh token exists in the user's refreshTokens array
        if (!user || !user.refreshTokens.includes(refreshToken)) {
          return res.status(403).json({ message: 'Invalid Refresh Token' });
        }

        // Generate new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          generateTokens(user);

        // Replace old refresh token with the new one

        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        user.refreshTokens.push(newRefreshToken);

        await user.save();

        // Set new Refresh Token in cookies
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });
        // Set new Access Token in cookies
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });

        // Fetch Latest User Data and attach it to req.user
        const updatedUser = await User.findById(user.id).select(
          '-password -refreshTokens'
        );

        req.user = updatedUser;

        return next();
      } catch {
        return res.status(403).json({ message: 'Invalid Refresh Token' });
      }
    }
    return res.status(403).json({ message: 'Invalid Token' });
  }
};

// Middleware for Role-Based Access Control
export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ success: false, message: 'Forbidden: Access Denied' });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Authorization Error' });
    }
  };
};
