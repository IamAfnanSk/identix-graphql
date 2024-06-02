import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET_KEY,
} from '../constants/global.js';

const signJWTToken = (JWTType: string, userId?: string, userEmail?: string, passwordResetSecret?: string): string => {
  if (!userId) return '';

  switch (JWTType) {
    case 'access':
      return jwt.sign({ id: userId }, JWT_ACCESS_SECRET_KEY, { expiresIn: JWT_ACCESS_EXPIRES_IN });

    case 'refresh':
      return jwt.sign({ id: userId, JWTAuthSecret: uuidv4() }, JWT_REFRESH_SECRET_KEY, {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
      });

    case 'email':
      // Check if email and password secret is present
      if (!userEmail || !passwordResetSecret) '';

      return jwt.sign({ id: userId, email: userEmail, passwordResetSecret }, JWT_ACCESS_SECRET_KEY, {
        expiresIn: '1h',
      });

    default:
      return '';
  }
};

export { signJWTToken };
