import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { ConfigEnvironment } from '~/config/env';
import { EPermissions } from '~/modules/account/models/permission.model';
import { RoleService } from '~/modules/account/services/role.service';
import { AppError } from '~/utils/app-error';

export const authAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError({
        id: 'middleware.authorize',
        message: 'UNAUTHORIZE',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, ConfigEnvironment.jwtAdminSecret) as jwt.JwtPayload & {
      id: string;
    };

    if (!decoded?.id) {
      throw new AppError({
        id: 'middleware.authorize',
        message: 'UNAUTHORIZE',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    req.headers.userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(
      new AppError({
        id: 'middleware.authorize',
        message: 'UNAUTHORIZE',
        statusCode: StatusCodes.UNAUTHORIZED,
      }),
    );
  }
};

export const checkPermissionMiddleware =
  (permission: EPermissions) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers.userId as string;

      if (!userId) {
        throw new AppError({
          id: 'middleware.permisison',
          message: 'FORBIDDEN',
          statusCode: StatusCodes.FORBIDDEN,
        });
      }

      await RoleService.checkPermission(userId, permission);

      req.headers.userId = userId;
      next();
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        return;
      }

      next(
        new AppError({
          id: 'middleware.permisison',
          message: 'FORBIDDEN',
          statusCode: StatusCodes.FORBIDDEN,
        }),
      );
    }
  };
