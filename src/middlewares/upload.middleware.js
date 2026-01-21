import multer from "multer";

export const createUploader = (fieldName = "image") => {
  const storage = multer.memoryStorage();

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
