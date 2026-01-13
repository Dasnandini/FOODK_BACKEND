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

    const admin = await prisma.admin.findFirst({
      where: {
        email: email.toLowerCase(),
        isDeleted: false,
        status: true,
      },
    });

    if (!admin) {
      return {
        status: 'FAIL',
        message: 'Invalid credentials',
      };
    }

    const isValid = await comparePassword(password, admin.password);
    if (!isValid) {
      return {
        status: 'FAIL',
        message: 'Invalid credentials',
      };
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
      role: admin.role, // 👈 IMPORTANT
    });

    return {
      status: 'SUCCESS',
      message: 'Login successful',
      token,
      role: admin.role, // frontend decides UI
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAIL',
      message: 'Login failed',
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

    const admin = await prisma.admin.findFirst({
      where: {
        id: decoded.id,
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
      return {
        status: 'FAIL',
        message: 'Session expired',
        clearCookie: true,
      };
    }

    return {
      status: 'SUCCESS',
      message: 'Authenticated',
      role: admin.role,
    };
  } catch {
    return {
      status: 'FAIL',
      message: 'Invalid or expired token',
      clearCookie: true,
    };
  }
};


export const logoutAdmin = async (adminId) => {
  try {
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        isLoggedOut: true,
      },
    });

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



export const getAdminProfile = async (token) => {
  try {
    if (!token) {
      return {
        status: 'FAIL',
        message: 'Not authenticated',
      };
    }

    const decoded = verifyToken(token);

    const admin = await prisma.admin.findFirst({
      where: {
        id: decoded.id,
        isDeleted: false,
        status: true,
        isLoggedOut: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        loginTime: true,
        deviceToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return {
        status: 'FAIL',
        message: 'Admin not found or session expired',
      };
    }

    return {
      status: 'SUCCESS',
      message: 'Profile fetched successfully',
      data: admin,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAIL',
      message: 'Invalid or expired token',
    };
  }
};

