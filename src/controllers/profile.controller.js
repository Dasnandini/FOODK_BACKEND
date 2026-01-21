import { getAdminProfileService } from "../services/profile.service.js";

export const getMyProfile = async (req, res) => {
  const response = await getAdminProfileService(req.user.id);

  res.status(response.serviceStatus === "Success" ? 200 : 401)
     .json(response);
};
