import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUser } from '~/modules/account/models/user.model';
import { HttpResponse } from '~/utils/http-response';
import { MessageFilters, SendMessageDTO, UpdateMessageDTO } from '../dtos/message.dto';
import { MessageService } from '../services/message.service';
import { tryParseJson } from '~/utils/helper';
import { AppError } from '~/utils/app-error';

export class MessageController {
  static async sendMessage(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const senderId = String(user?._id);
      const data = request.body as SendMessageDTO;

      const result = await MessageService.sendMessage(senderId, data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getMessages(request: Request, response: Response, next: NextFunction) {
    try {
      const query = request.query;

      const { page = 1, limit = 10, sort, order, filters } = query;

      const filterObject = tryParseJson(filters);

      const messageFilters: MessageFilters = {
        ...filterObject,
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order === 'ASC' ? 'ASC' : 'DESC',
      };

      if (!messageFilters.groupId) {
        throw new AppError({
          id: 'MessageController.getMessages',
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Dữ liệu không hợp lệ!',
        });
      }

      const result = await MessageService.getMessages(messageFilters);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async update(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const senderId = String(user?._id);
      const messageId = request.params.messageId as string;
      const data = request.body as UpdateMessageDTO;

      const result = await MessageService.updateMessage(messageId, senderId, data);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const senderId = String(user?._id);
      const messageId = request.params.messageId as string;

      const result = await MessageService.deleteMessage(messageId, senderId);

      response.status(StatusCodes.OK).json(HttpResponse.deleted({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
