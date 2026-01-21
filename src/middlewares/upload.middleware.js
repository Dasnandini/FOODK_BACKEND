import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/banners";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      "banner-" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

export const uploadBannerImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).single("image");
