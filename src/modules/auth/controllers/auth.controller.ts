import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '~/config/logger';
import { HttpResponse } from '~/utils/http-response';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';
import { IUser } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as RegisterDTO;

      const result = await AuthService.registerByAccount(data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as LoginDTO;

      const result = await AuthService.loginByAccount(data);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getMe(request: Request, response: Response, next: NextFunction) {
    try {
      // middleware passport jwt => user
      const user = request.user as IUser;
      const userId = String(user?._id);

      logger.info('user middleware passport jwt', user);

      const result = await AuthService.getMe(userId);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
