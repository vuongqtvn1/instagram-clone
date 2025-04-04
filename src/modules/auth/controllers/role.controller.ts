import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpResponse } from '~/utils/http-response';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';
import { RoleService } from '../services/role.service';

export class RoleController {
  static async createRole(request: Request, response: Response, next: NextFunction) {
    try {
      const data = request.body as CreateRoleDTO;

      const result = await RoleService.createRole(data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async updateRole(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id as string;
      const data = request.body as UpdateRoleDTO;

      const result = await RoleService.updateRole(id, data);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteRole(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id as string;

      const result = await RoleService.deleteRole(id);

      response.status(StatusCodes.OK).json(HttpResponse.deleted({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getPermissions(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await RoleService.getPermissions();

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getRoles(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await RoleService.getRoles();

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getRoleById(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id as string;

      const result = await RoleService.getRoleById(id);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
