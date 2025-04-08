import { extractPublicId } from 'cloudinary-build-url';

import { cloudinaryClient } from '../middlewares/multer';

export class UploadService {
  static async deleteFileByPath(path: string) {
    const publicId = extractPublicId(path);
    await cloudinaryClient.uploader.destroy(publicId);
  }

  static deleteFileByPaths = async (paths: string[]) => {
    const promises = paths.map(this.deleteFileByPath);
    await Promise.all(promises);
  };
}
