import {
  getVendorsService,
  getVendorByIdService,
  verifyVendorService
} from "../services/vendors.service.js";

export const getVendors = async (req, res) => {
  const response = await getVendorsService(req.query);
  res.json(response);
};

export const getVendorById = async (req, res) => {
  const response = await getVendorByIdService(req.query.id);
  res.json(response);
};

export const verifyVendor = async (req, res) => {
  const response = await verifyVendorService(req);
  res.json(response);
};
