import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '~/utils/app-error';
import { HttpResponse } from '~/utils/http-response';
import { RemoveFileDTO } from '../dtos/upload.dto';
import { UploadService } from '../services/upload.service';
import { EPostMediaType } from '~/modules/post/models/post.model';

export class UploadController {
  static async uploadImage(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.file?.path) {
        throw new AppError({
          id: 'upload.controller.uploadImage',
          message: 'Tải ảnh thất bại',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      response.status(StatusCodes.CREATED).json(
        HttpResponse.created({
          data: { type: EPostMediaType.Image, path: request.file.path },
        }),
      );
    } catch (error: any) {
      next(error);
    }
  }

  static async uploadVideo(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.file?.path) {
        throw new AppError({
          id: 'upload.controller.uploadVideo',
          message: 'Tải video thất bại',
          statusCode: StatusCodes.BAD_REQUEST,
        });
      }

      response.status(StatusCodes.CREATED).json(
        HttpResponse.created({
          data: { type: EPostMediaType.Video, path: request.file.path },
        }),
      );
    } catch (error: any) {
      next(error);
    }
  }

  static async removeFile(request: Request, response: Response, next: NextFunction) {
    try {
      const { paths } = request.body as RemoveFileDTO;

      await UploadService.deleteFileByPaths(paths);

      response.status(StatusCodes.OK).json(HttpResponse.deleted({ data: paths }));
    } catch (error: any) {
      next(error);
    }
  }
}
