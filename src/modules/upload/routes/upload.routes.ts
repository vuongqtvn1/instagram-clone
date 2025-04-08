import { Router } from 'express';

import passport from 'passport';
import { UploadController } from '../controllers/upload.controller';
import { uploadImageClient, uploadVideoClient } from '../middlewares/multer';
import { validate } from '~/middlewares/validate';
import { removeFileSchema } from '../validators/upload.validator';

const router = Router();

router.post(
  '/video',
  passport.authenticate('jwt', { session: false }),
  uploadVideoClient.single('video'),
  UploadController.uploadVideo,
);

router.post(
  '/image',
  passport.authenticate('jwt', { session: false }),
  uploadImageClient.single('image'),
  UploadController.uploadImage,
);

router.delete(
  '/by-paths',
  passport.authenticate('jwt', { session: false }),
  validate(removeFileSchema),
  UploadController.removeFile,
);

export default router;
