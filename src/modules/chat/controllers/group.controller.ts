import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IUser } from '~/modules/account/models/user.model';
import { AppError } from '~/utils/app-error';
import { tryParseJson } from '~/utils/helper';
import { HttpResponse } from '~/utils/http-response';
import { CreateGroupDTO, GroupMessageFilters, UpdateMemberGroupDTO } from '../dtos/group.dto';
import { GroupService } from '../services/group.service';

export class GroupController {
  static async create(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const createdBy = String(user?._id);
      const data = request.body as CreateGroupDTO;

      const result = await GroupService.create(createdBy, data);

      response.status(StatusCodes.CREATED).json(HttpResponse.created({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async getGroups(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userId = String(user?._id);
      const query = request.query;

      const { page = 1, limit = 10, sort, order, filters } = query;

      const filterObject = tryParseJson(filters);

      const groupFilters: GroupMessageFilters = {
        ...filterObject,
        userId,
        page: Number(page),
        limit: Number(limit),
        sort: sort as string,
        order: order === 'ASC' ? 'ASC' : 'DESC',
      };

      const result = await GroupService.getListGroup(groupFilters);

      response.status(StatusCodes.OK).json(HttpResponse.get({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async addMember(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const updatedBy = String(user?._id);
      const groupId = request.params.groupId as string;
      const data = request.body as UpdateMemberGroupDTO;

      const result = await GroupService.addMembers(updatedBy, groupId, data);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async removeMember(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const updatedBy = String(user?._id);
      const groupId = request.params.groupId as string;
      const data = request.body as UpdateMemberGroupDTO;

      const result = await GroupService.removeMembers(updatedBy, groupId, data);

      response.status(StatusCodes.OK).json(HttpResponse.updated({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }

  static async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = request.user as IUser;
      const userId = String(user?._id);
      const groupId = request.params.groupId as string;

      const result = await GroupService.removeGroup(userId, groupId);

      response.status(StatusCodes.OK).json(HttpResponse.deleted({ data: result }));
    } catch (error: any) {
      next(error);
    }
  }
}
