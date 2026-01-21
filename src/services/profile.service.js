import { PrismaClient } from "@prisma/client";
import ServiceResponse from "../utils/ServiceResponse.js";

const prisma = new PrismaClient();

export const getAdminProfileService = async (adminId) => {
  const response = new ServiceResponse();

  try {
    if (!adminId) {
      return response.fail("Admin ID is required");
    }

    const admin = await prisma.admin.findFirst({
      where: {
        id: adminId,
        isDeleted: false,
        status: true,
        isLoggedOut: false
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
        updatedAt: true
      }
    });

    if (!admin) {
      return response.fail("Admin not found or session expired");
    }

    return response.success(admin);
  } catch (err) {
    console.error(err);
    return response.fail("Failed to fetch profile");
  }
};
