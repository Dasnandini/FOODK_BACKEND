import { PrismaClient } from "@prisma/client";
import ServiceResponse from "../utils/ServiceResponse.js";

const prisma = new PrismaClient();

export const createCategoryService = async (req) => {
  const response = new ServiceResponse();

  try {
    const { name, slug } = req.body;

    if (!name) {
      return response.fail("Category name is required");
    }

    if (!slug) {
      return response.fail("Category slug is required");
    }

    let imageUrl = null;
    // if (req.file) {
    //   imageUrl = `${req.protocol}://${req.get("host")}/uploads/categories/${req.file.filename}`;
    // }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: req.body.parentId || null,
        image: imageUrl,
        priority: req.body.priority ? Number(req.body.priority) : 0,
        isHome: req.body.isHome === "true" || req.body.isHome === true,
        isPopular: req.body.isPopular === "true" || req.body.isPopular === true,
        status: req.body.status ?? true
      }
    });

    return response.success(category);

  } catch (err) {
    console.error(err);
    return response.fail("Something went wrong, please try again");
  }
};


export const getCategoriesService = async (query) => {
  const response = new ServiceResponse();

  try {
    const categories = await prisma.category.findMany({
      where: {
        isDeleted: false,
        ...query
      },
      orderBy: { priority: "asc" }
    });

    return response.success(categories);
  } catch (err) {
    return response.fail("Failed to fetch categories");
  }
};


export const getCategoryByIdService = async (id) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Category ID is required");
    }

    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false }
    });

    if (!category) {
      return response.fail("Category not found");
    }

    return response.success(category);
  } catch (err) {
    return response.fail("Failed to fetch category");
  }
};


export const updateCategoryService = async (id, req) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Category ID is required");
    }

    const body = req.body || {};
    const data = {};

    if (body.slug !== undefined) {
      data.slug = body.slug;
    }

    if (body.priority !== undefined) {
      data.priority = Number(body.priority);
    }

    if (body.isHome !== undefined) {
      data.isHome = body.isHome === "true" || body.isHome === true;
    }

    if (body.isPopular !== undefined) {
      data.isPopular = body.isPopular === "true" || body.isPopular === true;
    }

    if (body.status !== undefined) {
      data.status = body.status;
    }

    // 🔥 FIXED parentId logic
    if (Object.prototype.hasOwnProperty.call(body, "parentId")) {
      if (body.parentId === "") {
        data.parentId = null;
      } else {
        data.parentId = body.parentId;
      }
    }

    if (req.file) {
      data.image = null; // or actual image url
    }

    const category = await prisma.category.update({
      where: { id },
      data
    });

    return response.success(category);

  } catch (err) {
    console.error(err);
    return response.fail("Failed to update category");
  }
};





export const deleteCategoryService = async (id) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Category ID is required");
    }

    await prisma.category.update({
      where: { id },
      data: { isDeleted: true }
    });

    return response.success("Category deleted successfully");
  } catch (err) {
    return response.fail("Failed to delete category");
  }
};
