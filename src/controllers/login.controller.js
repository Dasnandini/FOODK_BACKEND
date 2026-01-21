import {
  loginAdmin,
  checkAuthStatus,
  logoutAdmin,

} from '../services/login.service.js';

import {
  setJwtCookie,
  clearJwtCookie,
} from '../utils/jwt.js';


export const login = async (req, res) => {
  const response = await loginAdmin(req.body);

  if (response.serviceStatus === "Fail") {
    return res.status(401).json(response);
  }

  setJwtCookie(res, response.serviceResponse.token);

  return res.status(200).json(response);
};



export const authStatus = async (req, res) => {
  const response = await checkAuthStatus(req.user.id);

  return res
    .status(response.serviceStatus === "Success" ? 200 : 401)
    .json(response);
};





export const logout = async (req, res) => {
  const response = await logoutAdmin(req.user.id);

  clearJwtCookie(res);

  return res
    .status(response.serviceStatus === "Success" ? 200 : 401)
    .json(response);
};





