import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { comparePassword } from '../utils/password.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

export const loginAdmin = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return {
        status: 'FAIL',
        message: 'Email and password are required',
      };
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return {
        status: 'FAIL',
        message: 'Email does not exist',
      };
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return {
        status: 'FAIL',
        message: 'Incorrect password',
      };
    }

    const token = generateToken({
      id: admin.id,
      role: admin.role,
    });

    return {
      status: 'SUCCESS',
      message: 'Login successful',
      token,
      role: admin.role,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAIL',
      message: 'Login failed, please try again',
    };
  }
};

export const checkAuthStatus = async (token) => {
  try {
    if (!token) {
      return {
        status: 'FAIL',
        message: 'Not authenticated',
        clearCookie: true,
      };
    }

    const decoded = verifyToken(token);

    return {
      status: 'SUCCESS',
      message: 'Authenticated',
      
    };
  } catch (err) {
    return {
      status: 'FAIL',
      message: 'Invalid or expired token',
      clearCookie: true,
    };
  }
};

export const logoutAdmin = async () => {
  try {
    return {
      status: 'SUCCESS',
      message: 'Logout successful',
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAIL',
      message: 'Logout failed',
    };
  }
};