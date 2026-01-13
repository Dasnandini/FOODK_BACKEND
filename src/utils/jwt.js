import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const cookieOptions = (maxAgeMs) => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,                   
    sameSite: isProd ? 'None' : 'Lax', 
    maxAge: maxAgeMs,
    path: '/',
  };
};

export const setJwtCookie = (res, token) => {
  res.cookie(
    process.env.COOKIE_NAME || 'jwt',
    token,
    cookieOptions(24 * 60 * 60 * 1000) 
  );
};

export const clearJwtCookie = (res) => {
  res.clearCookie(process.env.COOKIE_NAME || 'jwt', {
    path: '/',
  });
};
