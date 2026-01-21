import {
  createSuperAdminService,
  createAdminService
} from "../services/register.service.js";

export const onboardSuperAdmin = async (req, res) => {
  const response = await createSuperAdminService(req);

  res.status(response.serviceStatus === "Success" ? 201 : 400)
     .json(response);
};

export const createAdminUser = async (req, res) => {
  const response = await createAdminService(req);

  res.status(response.serviceStatus === "Success" ? 201 : 400)
     .json(response);
};
