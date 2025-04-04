import { StatusCodes } from 'http-status-codes';
import i18nClient from '~/i18n';
import { IAppError } from '~/types/error';

export class AppError implements IAppError {
  id: string;
  message: string; // id cua i18n
  statusCode: StatusCodes;
  detail?: any;
  errors?: Record<string, Array<{ id: string; message: string }>>; // id cua i18n
  params?: Record<string, any> = {};

  constructor({ id, message, statusCode, detail, errors, params }: IAppError) {
    this.id = id;
    this.message = message;
    this.statusCode = statusCode;
    this.detail = detail;
    this.errors = errors;
    this.params = params || {};
  }

  translate(locale: string) {
    const params = this.params || {};
    this.message = i18nClient.__({ phrase: this.message, locale }, params);

    if (this.errors) {
      const keys = Object.keys(this.errors);

      keys.forEach((key) => {
        if (this.errors && this.errors[key]) {
          this.errors[key] = this.errors[key].map((error) => {
            return {
              id: error.id,
              message: i18nClient.__({ phrase: error.id, locale }, params),
            };
          });
        }
      });
    }

    delete this.params;
  }
}
