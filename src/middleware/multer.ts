import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinaryConfig from "../utils/cloudinary";
import type { CustomParams } from "../types";

cloudinary.config(cloudinaryConfig);

export function uploadMiddleware() {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "images",
      allowedFormats: ["jpg", "png", "jpeg"],
    } as CustomParams,
  });

  const FILE_SIZE = 1024 * 1024 * 3;

  const multerConfig = multer({
    storage,
    limits: {
      fileSize: FILE_SIZE, //3MB
    },
    fileFilter: (_req: any, file: any, cb: any) => {
      if (!file.mimetype.startsWith("image/"))
        return cb(new Error("Only images are allowed"));
      if (file.size > FILE_SIZE)
        return cb(new Error("Image should not be more than 3MB"));
      cb(null, true);
    },
  });
  return { multerConfig, cloudinary };
}
