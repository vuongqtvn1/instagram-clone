import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUser } from '~/modules/account/models/user.model';
import { HttpResponse } from '~/utils/http-response';
import { CreatePostDTO, UpdatePostDTO } from '../dtos/post.dto';
import { PostService } from '../services/post.service';

export class PostController {
  static async create(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const data = request.body as CreatePostDTO;

      const result = await PostService.create(createdBy, data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async update(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const postId = request.params.id as string;
      const data = request.body as UpdatePostDTO;

      const result = await PostService.update({
        createdBy,
        postId,
        data,
      });

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const postId = request.params.id as string;

      const result = await PostService.delete({ postId, createdBy });

      response.status(StatusCodes.OK).json(HttpResponse.deleted({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getList(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await PostService.getList();

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  // static async getRoleById(request: Request, response: Response, next: NextFunction) {
  //   try {
  //     const id = request.params.id as string;

  //     const result = await RoleService.getRoleById(id);

  //     response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
  //   } catch (error: any) {
  //     next(error);
  //   }
  // }
}
