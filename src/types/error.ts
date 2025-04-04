import { StatusCodes } from 'http-status-codes';

export interface IFieldError {
  id: string;
  message: string;
}

export type IErrors = Record<string, IFieldError[]>;
export interface IAppError {
  id: string;
  message: string;
  statusCode: StatusCodes;
  detail?: any;
  errors?: IErrors;
  params?: Record<string, any>;
}
