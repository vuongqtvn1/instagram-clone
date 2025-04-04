import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '~/config/logger';
import { HttpResponse } from '~/utils/http-response';
import { LoginDTO, RegisterDTO } from '../dtos/user.dto';
import { IUser } from '../models/user.model';
import { UserService } from '../services/user.service';

export class UserController {
  static async register(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as RegisterDTO;

      const result = await UserService.registerByAccount(data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as LoginDTO;

      const result = await UserService.loginByAccount(data);

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

      const result = await UserService.getMe(userId);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async callbackSocial(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const token = UserService.generateToken(user);

      // redirect web user token jsonwebtoken => get me /@me by token login
      response.redirect(`http://localhost:5173/profile?token=${token}`);
    } catch (error) {
      next(error);
    }
  }
}
