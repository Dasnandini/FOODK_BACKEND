import { createAdmin, createSuperAdmin } from '../services/register.service.js';
export const onboardSuperAdmin = async (req, res) => {
  try {
    const admin = await createSuperAdmin(req.body);
    res.status(201).json({ message: 'Super Admin created', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const createAdminUser = async (req, res) => {
  try {
    const admin = await createAdmin(req.body, req.user.id);
    res.status(201).json({ message: 'Admin created', admin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


