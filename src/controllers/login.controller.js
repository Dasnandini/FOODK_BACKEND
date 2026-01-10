import { loginAdmin, checkAuthStatus, logoutAdmin  } from '../services/login.service.js';

export const login = async (req, res) => {
  const result = await loginAdmin(req.body);

  if (result.status === 'FAIL') {
    return res.status(401).json(result);
  }

  res.cookie('auth_token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, 
  });

  return res.status(200).json({
    status: 'SUCCESS',
    message: result.message,
   
  });
};

export const authStatus = async (req, res) => {
  const token = req.cookies.auth_token;

  const result = await checkAuthStatus(token);

  if (result.clearCookie) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  if (result.status === 'FAIL') {
    return res.status(401).json(result);
  }

  return res.status(200).json(result);
};
export const logout = async (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  const response = await logoutAdmin();
  return res.status(200).json(response);
};
