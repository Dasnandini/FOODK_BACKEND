import express from 'express';
import { getMyProfile, login } from '../controllers/login.controller.js';
import { onboardSuperAdmin, createAdminUser,} from '../controllers/register.controller.js';
import { logout, authStatus } from '../controllers/login.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = express.Router();


router.post('/login', login);
router.post('/super-admin', onboardSuperAdmin); 
router.post(
  '/registeradmin',
  authenticate,
  authorize('SUPER_ADMIN'),
  createAdminUser
);
router.post('/logout', logout);
router.get('/status', authenticate, authStatus);
router.get('/me', getMyProfile);

export default router;
