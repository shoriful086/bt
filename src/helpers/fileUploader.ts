import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import fs from "fs";
import { ICloudinaryResponse, IFileType } from "../app/interfaces/fileUpload";

// Configuration
cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

// upload photo multer with disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload an image
const uploadCloudinary = async (
  file: IFileType
): Promise<ICloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      {
        public_id: file.originalname,
      },
      (error: any, result: any) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
export const fileUploader = {
  upload,
  uploadCloudinary,
};
