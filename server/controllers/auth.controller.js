import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config/env.js';

import User from '../models/user.model.js';

import { generateTokens } from '../lib/token.js';

export const signUpController = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation Check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array(),
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email });

    // Check if user already exists
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(newUser);
    newUser.refreshTokens.push(refreshToken);
    await newUser.save();

    // Set Refresh Token in HTTP-only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    // Set Access Token in HTTP-only Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Exclude refreshToken before sending response
    const {
      refreshTokens: _,
      password: __,
      ...userWithoutSensitiveData
    } = newUser.toObject();

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutSensitiveData,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const signInController = async (req, res, next) => {
  const { email, password } = req.body;

  // Validation Check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: true,
      message: 'Validation Error',
      errors: errors.array(),
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: `User doesn't exist` });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: 'Invalid Credentials' });

    // Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set Refresh Token in HTTP-only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    // Set Access Token in HTTP-only Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Exclude sensitive data from the user object before sending it in response
    const {
      refreshTokens: _,
      password: __,
      ...userWithoutSensitiveData
    } = user.toObject();

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: {
        user: userWithoutSensitiveData,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const signOutController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken; // Extract Refresh Token

    if (!refreshToken) {
      return res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });
    }

    // Find the user with this refresh token
    const user = await User.findOne({ refreshTokens: refreshToken });

    if (user) {
      // Remove the refresh token from the user's stored tokens
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      await user.save();
    }

    // Clear the authentication cookies
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return res
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const userController = async (req, res) => {
  try {
    // Extract token from headers
    const accessToken = req.cookies?.accessToken; // Extract Refresh Token

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN);

    // Fetch user details (excluding sensitive fields like password)
    const user = await User.findById(decoded.id).select(
      '-password -refreshTokens'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    return res.status(200).json({ data: user });
  } catch (error) {
    console.error('Auth check failed:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
