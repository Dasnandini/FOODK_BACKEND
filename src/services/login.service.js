import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { comparePassword } from '../utils/password.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

import ServiceResponse from '../utils/ServiceResponse.js';


export const loginAdmin = async ({ email, password }) => {
  const response = new ServiceResponse();

  try {
    if (!email || !password) {
      return response.fail('Email and password are required');
    }

    const admin = await prisma.admin.findFirst({
      where: {
        email: email.toLowerCase(),
        isDeleted: false,
        status: true,
      },
    });

    if (!admin) {
      return response.fail('Invalid credentials');
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return response.fail('Invalid credentials');
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        loginTime: new Date(),
        isLoggedOut: false,
      },
    });

    const token = generateToken({
      id: admin.id,
      role: admin.role,
    });

    return response.success({
      token,
      role: admin.role,
      message: 'Login successful',
    });

  } catch (err) {
    console.error(err);
    return response.fail('Login failed');
  }
};




export const checkAuthStatus = async (adminId) => {
  const response = new ServiceResponse();

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        id: adminId,
        isDeleted: false,
        status: true,
        isLoggedOut: false,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin) {
      return response.fail('Session expired or logged out');
    }

    return response.success({
      tokenValid: true,
      role: admin.role,
      message: 'Token is valid',
    });

  } catch (err) {
    console.error(err);
    return response.fail('Authentication check failed');
  }
};




export const logoutAdmin = async (adminId) => {
  const response = new ServiceResponse();

  try {
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        isLoggedOut: true,
      },
    });

    return response.success('Logout successful');

  } catch (err) {
    console.error(err);
    return response.fail('Logout failed');
  }
};







