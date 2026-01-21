import express from 'express';
import {  login } from '../controllers/login.controller.js';
import { onboardSuperAdmin, createAdminUser,} from '../controllers/register.controller.js';
import { logout, authStatus } from '../controllers/login.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { getMyProfile } from '../controllers/profile.controller.js';
import { createCategory, getCategories, getCategoryById, updateCategory,deleteCategory } from '../controllers/category.controller.js';
import { createBanner, deleteBanner, getBannerById, getBanners, updateBanner, } from '../controllers/banner.controller.js';
import { getDeliveryAgentById, getDeliveryAgents, verifyDeliveryAgent } from '../controllers/deliveryAgent.controller.js';
import { getVendorById, getVendors, verifyVendor } from '../controllers/vendor.controller.js';
import { createUploader } from '../middlewares/upload.middleware.js';

const router = express.Router();


router.post('/login', login);
router.post('/super-admin', onboardSuperAdmin); 
router.post(
  '/registeradmin', authenticate, authorize('SUPER_ADMIN'), createAdminUser
);
router.post('/logout',authenticate, logout);
router.get('/status', authenticate, authStatus);
router.get('/me',authenticate, getMyProfile);

router.post("/addCategory",createUploader("categories", "image"), createCategory);
router.get("/getCategory", getCategories);
router.get("/getCategorybyid", getCategoryById);
router.put("/updateCategorybyid", updateCategory);
router.delete("/deleteCategoryid", deleteCategory);

router.post("/addBanner",createUploader("banners", "image"), createBanner);
router.get("/getBanner", getBanners);
router.get("/getBannerbyid", getBannerById);
router.put("/updateBannerbyid", updateBanner);
router.delete("/deleteBannerbyid", deleteBanner);



router.get("/getAllDeliveryAgents", getDeliveryAgents);
router.get("/getDeliveryAgentById", getDeliveryAgentById);
router.put("/verifyDeliveryAgent/:id/verify", verifyDeliveryAgent);

router.get("/getAllvendors", getVendors);
router.get("/getVendersById", getVendorById);
router.put("/verifyVendors/:id/verify", verifyVendor);

export default router;
