import jwt from 'jsonwebtoken';

interface MyJwtPayload {
  id?: string;
  email?: string;
  passwordResetSecret?: string;
  JWTAuthSecret?: string;
}

const getDecodedJWT = (token: string, secret: string): jwt.JwtPayload & MyJwtPayload => {
  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string') {
      return {};
    }

    return decoded;
  } catch (error) {
    return {};
  }
};

export { getDecodedJWT };
