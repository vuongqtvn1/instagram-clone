import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUser } from '~/modules/account/models/user.model';
import { HttpResponse } from '~/utils/http-response';
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
      const result = await CommentService.getListByPost(postId);

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
