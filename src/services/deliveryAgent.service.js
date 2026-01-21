import { PrismaClient } from "@prisma/client";
import ServiceResponse from "../utils/ServiceResponse.js";

const prisma = new PrismaClient();

export const getDeliveryAgentsService = async (query) => {
  const response = new ServiceResponse();

  try {
    const agents = await prisma.deliveryagent.findMany({
      where: {
        isDeleted: false,
        ...query
      },
      orderBy: { createdAt: "desc" }
    });

    return response.success(agents);
  } catch (err) {
    console.error(err);
    return response.fail("Failed to fetch delivery agents");
  }
};

export const getDeliveryAgentByIdService = async (id) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Delivery agent ID is required");
    }

    const agent = await prisma.deliveryagent.findFirst({
      where: {
        id,
        isDeleted: false
      }
    });

    if (!agent) {
      return response.fail("Delivery agent not found");
    }

    return response.success(agent);
  } catch (err) {
    return response.fail("Failed to fetch delivery agent");
  }
};

export const verifyDeliveryAgentService = async (req) => {
  const response = new ServiceResponse();

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return response.fail("Delivery agent ID is required");
    }

    if (!status) {
      return response.fail("Verification status is required");
    }

    const allowedStatuses = ["VERIFIED", "REJECTED", "RESUBMIT"];
    if (!allowedStatuses.includes(status)) {
      return response.fail("Invalid verification status");
    }

    const agent = await prisma.deliveryagent.update({
      where: { id },
      data: {
        isVerified: status === "VERIFIED",
        verificationStatus: status,
        verifiedAt: new Date()
      }
    });

    return response.success(agent);
  } catch (err) {
    console.error(err);
    return response.fail("Failed to verify delivery agent");
  }
};
