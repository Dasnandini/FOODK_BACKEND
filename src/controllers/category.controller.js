import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService
} from "../services/category.service.js";

export const createCategory = async (req, res) => {
  const response = await createCategoryService(req);
  res.status(response.serviceStatus === "Success" ? 201 : 400).json(response);
};

export const getCategories = async (req, res) => {
  const response = await getCategoriesService(req.query);
  res.json(response);
};

export const getCategoryById = async (req, res) => {
  const response = await getCategoryByIdService(req.query.id);
  res.json(response);
};

export const updateCategory = async (req, res) => {
  const response = await updateCategoryService(req.query.id, req.body);
  res.json(response);
};

export const deleteCategory = async (req, res) => {
  const response = await deleteCategoryService(req.query.id);
  res.json(response);
};
