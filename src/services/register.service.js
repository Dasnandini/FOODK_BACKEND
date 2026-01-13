import { hashPassword } from '../utils/password.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createSuperAdmin = async (data) => {
  try {
    const existing = await prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN', isDeleted: false },
    });

    if (existing) {
      return {
        status: 'FAIL',
        message: 'Super Admin already exists',
      };
    }

    await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        password: await hashPassword(data.password),
        role: 'SUPER_ADMIN',
        status: true,
        isLoggedOut: false,
      },
    });

    return {
      status: 'SUCCESS',
      message: 'Super Admin created successfully',
      data: null,
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAIL',
      message: 'Something went wrong, please try again',
    };
  }
};



export const createAdmin = async (data) => {
  try {
    const email = data.email.toLowerCase();

    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return {
        status: 'FAIL',
        message: 'Email already exists',
      };
    }

    await prisma.admin.create({
      data: {
        name: data.name,
        email,
        password: await hashPassword(data.password),
        role: 'ADMIN',
        status: true,
        isLoggedOut: false,
      },
    });

    return {
      status: 'SUCCESS',
      message: 'Admin created successfully',
    };
  } catch (err) {
    console.error(err);
    return {
      status: 'FAIL',
      message: 'Unable to create admin',
    };
  }
};



// export const getAllAdmins = async () => {
//   try {
//     const admins = await prisma.admin.findMany({
//       where: { role: 'SUPER_ADMIN' },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         isVerified: true,
//         createdAt: true,
//         createdBy: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return {
//       status: 'SUCCESS',
//       message: 'Admins list fetched successfully',
//       data: admins,
//     };

//   } catch (err) {
//     console.error(err);
//     return {
//       status: 'FAIL',
//       message: 'Unable to fetch admins',
//     };
//   }
// };
