import { PrismaClient } from "@prisma/client";
import ServiceResponse from "../utils/ServiceResponse.js";

const prisma = new PrismaClient();

export const getVendorsService = async (query) => {
  const response = new ServiceResponse();

  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        isDeleted: false,
        ...query
      },
      orderBy: { createdAt: "desc" }
    });

    return response.success(vendors);
  } catch (err) {
    console.error(err);
    return response.fail("Failed to fetch vendors");
  }
};

export const getVendorByIdService = async (id) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Vendor ID is required");
    }

    const vendor = await prisma.vendor.findFirst({
      where: {
        id,
        isDeleted: false
      }
    });

    if (!vendor) {
      return response.fail("Vendor not found");
    }

    return response.success(vendor);
  } catch (err) {
    console.error(err);
    return response.fail("Failed to fetch vendor");
  }
};


export const verifyVendorService = async (req) => {
  const response = new ServiceResponse();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return response.fail("Vendor ID is required");
    }

    if (!status) {
      return response.fail("Verification status is required");
    }

    const allowedStatuses = ["VERIFIED", "REJECTED", "RESUBMIT"];
    if (!allowedStatuses.includes(status)) {
      return response.fail("Invalid verification status");
    }

    const vendor = await prisma.vendor.update({
      where: { id },
      data: {
        isVerified: status === "VERIFIED",
        verificationStatus: status,
        verifiedAt: new Date()
      }
    });

    return response.success(vendor);
  } catch (err) {
    console.error(err);
    return response.fail("Failed to verify vendor");
  }
};
