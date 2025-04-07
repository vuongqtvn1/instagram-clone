import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpResponse } from '~/utils/http-response';
import { CreateAdminDTO, LoginAdminDTO } from '../dtos/admin.dto';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async create(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as CreateAdminDTO;

      const result = await AdminService.createAdmin(data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async login(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as LoginAdminDTO;

      const result = await AdminService.loginByAccount(data);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getMe(request: Request, response: Response, next: NextFunction) {
    try {
      const userId = request.headers.userId as string;

      const result = await AdminService.getMe(userId);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
