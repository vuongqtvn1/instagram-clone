import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUser } from '~/modules/account/models/user.model';
import { HttpResponse } from '~/utils/http-response';
import { CreatePostDTO, PostFilters, UpdatePostDTO } from '../dtos/post.dto';
import { PostService } from '../services/post.service';
import { tryParseJson } from '~/utils/helper';

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

  static async getByFollowings(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userId = String(user?._id);
      const query = request.query;

      const { page = 1, limit = 10, sort, order, filters } = query;

      const filterObject = tryParseJson(filters);

      const postFilters: PostFilters = {
        ...filterObject,
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order === 'ASC' ? 'ASC' : 'DESC',
      };

      const result = await PostService.getByFollowings(userId, postFilters);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getExplore(request: Request, response: Response, next: NextFunction) {
    try {
      const query = request.query;

      const { page = 1, limit = 10, sort, order, filters } = query;

      const filterObject = tryParseJson(filters);

      const postFilters: PostFilters = {
        ...filterObject,
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order === 'ASC' ? 'ASC' : 'DESC',
      };

      const result = await PostService.getExplore(postFilters);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async likePost(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userLike = String(user?._id);
      const postId = request.params.id as string;

      const result = await PostService.likePost(postId, userLike);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async unlikePost(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userUnlike = String(user?._id);
      const postId = request.params.id as string;

      const result = await PostService.unlikePost(postId, userUnlike);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async savePost(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userSave = String(user?._id);
      const postId = request.params.id as string;

      const result = await PostService.savePost(postId, userSave);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async unSavePost(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userUnsave = String(user?._id);
      const postId = request.params.id as string;

      const result = await PostService.unsavePost(postId, userUnsave);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
