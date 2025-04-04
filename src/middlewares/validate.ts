import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnySchema } from 'yup';
import { AppError } from '~/utils/app-error';
import { formatErrorYup } from '~/utils/helper';

export const validate = (schema: AnySchema) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (errorYup) {
      const errors = formatErrorYup(errorYup);

      next(
        new AppError({
          id: 'middleware.validate',
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'INVALID_BODY',
          errors,
        }),
      );
    }
  };
};
