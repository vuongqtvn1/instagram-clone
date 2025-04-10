import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

cloudinary.config({
  cloud_name: 'vuongute',
  api_key: '448585553237892',
  api_secret: 'kHsci-mPjr-AZOPHpw56Vc8Yw5I',
});

export class UploadService {
  static async deleteFileByPath(path: string) {
    const publicId = extractPublicId(path);
    await cloudinary.uploader.destroy(publicId);
  }

  static deleteFileByPaths = async (paths: string[]) => {
    const promises = paths.map(this.deleteFileByPath);
    await Promise.all(promises);
  };
}
