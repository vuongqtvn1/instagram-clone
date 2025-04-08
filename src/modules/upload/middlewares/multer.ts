import { v2 as cloudinaryClient } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

cloudinaryClient.config({
  cloud_name: 'vuongute',
  api_key: '448585553237892',
  api_secret: 'kHsci-mPjr-AZOPHpw56Vc8Yw5I',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryClient,
  params: { folder: 'instagram' } as any,
});

const maxImageSize = 2;
const maxVideoSize = 5;

const uploadImageClient = multer({
  storage,
  limits: {
    fileSize: maxImageSize * 1024 * 1024, // 2Mb
  },
  fileFilter: (req, file, cb) => {
    const acceptedExtensionsList = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (acceptedExtensionsList.includes(extname)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid image file'));
    }
  },
});

const uploadVideoClient = multer({
  storage,
  limits: {
    fileSize: maxVideoSize * 1024 * 1024, // 5Mb
  },
  fileFilter: (req, file, cb) => {
    const acceptedExtensionsList = ['.mp4', '.webm', '.mov'];
    const extname = path.extname(file.originalname).toLowerCase();

    if (acceptedExtensionsList.includes(extname)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid video file'));
    }
  },
});

export { cloudinaryClient, uploadVideoClient, uploadImageClient };
