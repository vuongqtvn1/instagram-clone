import { StatusCodes } from 'http-status-codes';

export interface IAppError {
  id: string;
  message: string;
  statusCode: StatusCodes;
  detail?: any;
  errors?: Record<string, Array<{ id: string; message: string }>>;
  params?: Record<string, any>;
}
