import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUser } from '~/modules/account/models/user.model';
import { HttpResponse } from '~/utils/http-response';
import { BaseFilters } from '~/utils/repository';
import { CreateCommentDTO, ReplyCommentDTO, UpdateCommentDTO } from '../dtos/comment.dto';
import { CommentService } from '../services/comment.service';

export class CommentController {
  static async create(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const data = request.body as CreateCommentDTO;

      const result = await CommentService.create(createdBy, data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async reply(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const data = request.body as ReplyCommentDTO;

      const result = await CommentService.reply(createdBy, data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async update(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const commentId = request.params.id as string;
      const data = request.body as UpdateCommentDTO;

      const result = await CommentService.update({
        createdBy,
        data,
        commentId,
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
      const commentId = request.params.id as string;

      const result = await CommentService.delete({ commentId, createdBy });

      response.status(StatusCodes.OK).json(HttpResponse.deleted({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getListByPost(request: Request, response: Response, next: NextFunction) {
    try {
      const postId = request.params.id as string;
      const query = request.query;

      const { page = 1, limit = 10, sort, order } = query;

      const filters: BaseFilters = {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order === 'ASC' ? 'ASC' : 'DESC',
      };

      const result = await CommentService.getListByPost(postId, filters);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getListReplyByComment(request: Request, response: Response, next: NextFunction) {
    try {
      const postId = request.params.id as string;
      const parentCommentId = request.params.commentId as string;
      const query = request.query;

      const { page = 1, limit = 10, sort, order } = query;

      const filters: BaseFilters = {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order === 'ASC' ? 'ASC' : 'DESC',
      };

      const result = await CommentService.getListByComment(postId, parentCommentId, filters);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
  static async likeComment(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userLike = String(user?._id);
      const commentId = request.params.id as string;

      const result = await CommentService.likeComment(commentId, userLike);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async unlikeComment(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userUnlike = String(user?._id);
      const commentId = request.params.id as string;

      const result = await CommentService.unlikeComment(commentId, userUnlike);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
