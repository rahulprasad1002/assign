import jwt from 'jsonwebtoken';

import { ACCESS_TOKEN, REFRESH_TOKEN } from '../config/env.js';

// Generate Access & Refresh Tokens
export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    ACCESS_TOKEN,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN, {
    expiresIn: '7d',
  });

  return {
    accessToken,
    refreshToken,
  };
};
