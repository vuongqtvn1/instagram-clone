import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import type { Request } from 'express';
import type { StorageEngine } from 'multer';

cloudinary.config({
  cloud_name: 'vuongute',
  api_key: '448585553237892',
  api_secret: 'kHsci-mPjr-AZOPHpw56Vc8Yw5I',
});

class CloudinaryStorage implements StorageEngine {
  private cloudinary = cloudinary;
  private options: UploadApiOptions;

  constructor(options: UploadApiOptions & { folder: string }) {
    this.options = options;
  }

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): Promise<void> {
    try {
      const response = await this.upload(file, this.options);

      callback(undefined, {
        path: response.secure_url,
        size: response.bytes,
        filename: response.public_id,
      });
    } catch (err) {
      callback(err);
    }
  }

  _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error) => void): void {
    this.cloudinary.uploader.destroy(file.filename, { invalidate: true }, callback);
  }

  private upload(
    file: Express.Multer.File,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(options, (error, response) => {
        if (error) return reject(error);

        if (!response) return reject(new Error('Upload File Failed'));

        return resolve(response);
      });

      file.stream.pipe(stream);
    });
  }
}

function createCloudinaryStorage(
  options: UploadApiOptions & { folder: string },
): CloudinaryStorage {
  return new CloudinaryStorage(options);
}

export default createCloudinaryStorage;
