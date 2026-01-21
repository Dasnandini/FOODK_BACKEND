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

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        parentId: req.body.parentId || null,
        image: req.body.image || null,
        priority: req.body.priority || 0,
        isHome: req.body.isHome || false,
        isPopular: req.body.isPopular || false,
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


export const updateCategoryService = async (id, data) => {
  const response = new ServiceResponse();

  try {
    if (!id) {
      return response.fail("Category ID is required");
    }

    const category = await prisma.category.update({
      where: { id },
      data
    });

    return response.success(category);
  } catch (err) {
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
