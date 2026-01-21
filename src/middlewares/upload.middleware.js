import multer from "multer";
import path from "path";
import fs from "fs";


export const createUploader = (folderName, fieldName = "image") => {
  const uploadDir = `uploads/${folderName}`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName =
        `${fieldName}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only image files are allowed"));
      }
      cb(null, true);
    }
  }).single(fieldName);
};
