import { PrismaClient } from "@prisma/client";
import ServiceResponse from "../utils/ServiceResponse.js";

const prisma = new PrismaClient();


export const createBannerService = async (req) => {
  const response = new ServiceResponse();

  try {
    if (!req.file) {
      return response.fail("Banner image is required");
    }

    if (!req.body.bannerType) {
      return response.fail("Banner type is required");
    }
    const imageUrl = null;
    const bannerData = {
      bannerType: req.body.bannerType,
      categoryId: req.body.categoryId || null,
      restaurantId: req.body.restaurantId || null,
      link: req.body.link || null,
      image: imageUrl,
      imageType: req.file.mimetype,
      status: true
    };
    const banner = await prisma.banner.create({ data: bannerData });
    return response.success(banner);
  } catch (err) {
    console.error(err);
    return response.fail("Something went wrong, please try again");
  }
};


export const getBannersService = async (query) => {
  const response = new ServiceResponse();

  try {
    const banners = await prisma.banner.findMany({
      where: {
        isDeleted: false,
        ...query
      },
      orderBy: { createdAt: "desc" }
    });

    return response.success(banners);
  } catch (err) {
    return response.fail("Failed to fetch banners");
  }
};


export const getBannerByIdService = async (id) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Banner ID is required");
    }

    const banner = await prisma.banner.findFirst({
      where: { id, isDeleted: false }
    });

    if (!banner) {
      return response.fail("Banner not found");
    }

    return response.success(banner);
  } catch (err) {
    return response.fail("Failed to fetch banner");
  }
};





export const deleteBannerService = async (id) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Banner ID is required");
    }

    await prisma.banner.update({
      where: { id },
      data: { isDeleted: true }
    });

    return response.success("Banner deleted successfully");
  } catch (err) {
    return response.fail("Failed to delete banner");
  }
};
