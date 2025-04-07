import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { ConfigEnvironment } from '~/config/env';
import { AppError } from '~/utils/app-error';
import { CreateAdminDTO, LoginAdminDTO } from '../dtos/admin.dto';
import { IUserAdmin } from '../models/admin.model';
import { AdminRepository } from '../repositories/admin.repository';

export class AdminService {
  static generateToken(user: IUserAdmin) {
    // generate token jsonwebtoken 1 day expire
    const token = jwt.sign({ id: user._id }, ConfigEnvironment.jwtAdminSecret, {
      expiresIn: '1d', // 1 day
    });

    return token;
  }

  static withoutPassword(user: IUserAdmin) {
    const { password, ...data } = user;
    return data;
  }

  static async getById(userId: string) {
    const user = await AdminRepository.getById(userId);

    return user;
  }

  static async getByEmail(email: string) {
    const user = await AdminRepository.getByEmail(email);

    return user;
  }

  static async getMe(userId: string) {
    // b1. check user exist
    const user = await AdminRepository.getById(userId);

    if (!user) {
      throw new AppError({
        id: 'AdminService.getMe',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'UNAUTHORIZE',
      });
    }

    // b2. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async createAdmin(data: CreateAdminDTO) {
    const existingUser = await this.getByEmail(data.email);

    if (existingUser) {
      throw new AppError({
        id: 'AdminService.createAdmin',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'INVALID_BODY',
        errors: { email: [{ id: 'EMAIL_EXISTED', message: 'EMAIL_EXISTED' }] },
      });
    }

    const password = data.password ? data.password : 'Asdfgh112@';

    // b2. hashing password => saving database user
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await AdminRepository.create({ ...data, password: passwordHash });

    return this.withoutPassword(user);
  }

  static async loginByAccount(data: LoginAdminDTO) {
    const user = await AdminRepository.getByEmail(data.email);

    if (!user) {
      throw new AppError({
        id: 'AdminService.loginByAccount',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'ACCOUNT_NOT_CORRECT',
        errors: {
          email: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
          password: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
        },
      });
    }

    // b2. compare password => password hash === password client
    const isMatching = bcrypt.compareSync(data.password, user.password);

    if (!isMatching) {
      throw new AppError({
        id: 'AdminService.loginByAccount',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'ACCOUNT_NOT_CORRECT',
        errors: {
          email: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
          password: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
        },
      });
    }

    // b3. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }
}
