import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../utils/password.js";
import ServiceResponse from "../utils/ServiceResponse.js";

const prisma = new PrismaClient();


export const createSuperAdminService = async (req) => {
  const response = new ServiceResponse();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return response.fail("Name, email, and password are required");
    }

    const existing = await prisma.admin.findFirst({
      where: { role: "SUPER_ADMIN", isDeleted: false }
    });

    if (existing) {
      return response.fail("Super Admin already exists");
    }

    await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: await hashPassword(password),
        role: "SUPER_ADMIN",
        status: true,
        isLoggedOut: false
      }
    });

    return response.success("Super Admin created successfully");
  } catch (err) {
    console.error(err);
    return response.fail("Something went wrong, please try again");
  }
};


export const createAdminService = async (req) => {
  const response = new ServiceResponse();

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return response.fail("Name, email, and password are required");
    }

    const normalizedEmail = email.toLowerCase();

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingAdmin) {
      return response.fail("Email already exists");
    }

    await prisma.admin.create({
      data: {
        name,
        email: normalizedEmail,
        password: await hashPassword(password),
        role: "ADMIN",
        status: true,
        isLoggedOut: false,
      }
    });

    return response.success("Admin created successfully");
  } catch (err) {
    console.error(err);
    return response.fail("Unable to create admin");
  }
};
