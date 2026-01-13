import {
  loginAdmin,
  checkAuthStatus,
  logoutAdmin,
  getAdminProfile,
} from '../services/login.service.js';

import {
  setJwtCookie,
  clearJwtCookie,
} from '../utils/jwt.js';


export const login = async (req, res) => {
  const result = await loginAdmin(req.body);

  if (result.status === 'FAIL') {
    return res.status(401).json(result);
  }

  
  setJwtCookie(res, result.token);

  return res.status(200).json({
    status: 'SUCCESS',
    message: result.message,
  });
};


export const authStatus = async (req, res) => {
  const token = req.cookies[process.env.COOKIE_NAME || 'jwt'];

  const result = await checkAuthStatus(token);

  if (result.clearCookie) {
    clearJwtCookie(res);
  }

  if (result.status === 'FAIL') {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
};


export const logout = async (req, res) => {
 
  const token = req.cookies[process.env.COOKIE_NAME || 'jwt'];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await logoutAdmin(decoded.id);
    } catch (err) {
      console.error('Logout token error:', err.message);
    }
  }

  clearJwtCookie(res);

  return res.status(200).json({
    status: 'SUCCESS',
    message: 'Logout successful',
  });
};


export const getMyProfile = async (req, res) => {


  const token = req.cookies[process.env.COOKIE_NAME || 'auth_token'];

  const result = await getAdminProfile(token);

  if (result.status === 'FAIL') {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
};
