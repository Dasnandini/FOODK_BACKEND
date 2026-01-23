import {
  createBannerService,
  getBannersService,
  getBannerByIdService,
  deleteBannerService
} from "../services/banner.service.js";

export const createBanner = async (req, res) => {
  const response = await createBannerService(req);
  res.status(response.serviceStatus === "Success" ? 201 : 400).json(response);
};

export const getBanners = async (req, res) => {
  const response = await getBannersService(req.query);
  res.json(response);
};

export const getBannerById = async (req, res) => {
  const response = await getBannerByIdService(req.query.id);
  res.json(response);
};



export const deleteBanner = async (req, res) => {
  const response = await deleteBannerService(req.query.id);
  res.json(response);
};
