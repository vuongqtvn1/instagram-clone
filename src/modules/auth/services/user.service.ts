import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash';

import { ConfigEnvironment } from '~/config/env';
import { LoginDTO, RegisterDTO } from '../dtos/user.dto';
import { EAuthProvider, IUser } from '../models/user.model';
import { AppError } from '~/utils/app-error';
import { UserRepository } from '../repositories/user.repository';
import { IErrors } from '~/types/error';

export class UserService {
  static generateToken(user: IUser) {
    // generate token jsonwebtoken 1 day expire
    const token = jwt.sign({ id: user._id }, ConfigEnvironment.jwtSecret, {
      expiresIn: '1d', // 1 day
    });

    return token;
  }

  static withoutPassword(user: IUser) {
    const { password, ...data } = user;
    return data;
  }

  static async getById(userId: string) {
    const user = await UserRepository.getById(userId);

    return user;
  }

  static async getByEmail(email: string) {
    const user = await UserRepository.getByEmail(email);

    return user;
  }

  static async getMe(userId: string) {
    // b1. check user exist
    const user = await UserRepository.getById(userId);

    if (!user) {
      throw new AppError({
        id: 'UserService.getMe',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'UNAUTHORIZE',
      });
    }

    // b2. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async registerByAccount(data: RegisterDTO) {
    // b1. check email exist
    const errors: IErrors = {};

    const existingUser = await this.getByEmail(data.email);

    if (existingUser) {
      errors.email = [{ id: 'EMAIL_EXISTED', message: 'EMAIL_EXISTED' }];
    }

    // b1. check email exist
    const existingUserName = await UserRepository.getByKey('username', data.username);

    if (existingUserName) {
      errors.username = [{ id: 'USERNAME_EXISTED', message: 'USERNAME_EXISTED' }];
    }

    if (!isEmpty(errors)) {
      throw new AppError({
        id: 'UserService.registerByAccount',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'INVALID_BODY',
        errors,
      });
    }

    // b2. hashing password => saving database user
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    const user = await UserRepository.registerByAccount(EAuthProvider.Account, {
      ...data,
      password: passwordHash,
    });

    // b3. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async loginByAccount(data: LoginDTO) {
    // b1. check user exist
    const user = await UserRepository.getByUsernameOrEmail(data.username);

    if (!user) {
      throw new AppError({
        id: 'UserService.loginByAccount',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'ACCOUNT_NOT_CORRECT',
        errors: {
          username: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
          password: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
        },
      });
    }

    // b2. compare password => password hash === password client
    const isMatching = bcrypt.compareSync(data.password, user.password);

    if (!isMatching) {
      throw new AppError({
        id: 'UserService.loginByAccount',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'ACCOUNT_NOT_CORRECT',
        errors: {
          username: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
          password: [{ id: 'ACCOUNT_NOT_CORRECT', message: 'ACCOUNT_NOT_CORRECT' }],
        },
      });
    }

    // b3. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async registerBySocial(provider: EAuthProvider, data: RegisterDTO) {
    const userSocial = await this.getByEmail(data.email);

    // exist user provider
    if (userSocial) {
      return userSocial;
    }

    // b1. check email exist
    const errors: IErrors = {};

    const existingUser = await this.getByEmail(data.email);

    if (existingUser) {
      errors.email = [{ id: 'EMAIL_EXISTED', message: 'EMAIL_EXISTED' }];
    }

    // b1. check email exist
    const existingUserName = await UserRepository.getByKey('username', data.username);

    if (existingUserName) {
      errors.username = [{ id: 'USERNAME_EXISTED', message: 'USERNAME_EXISTED' }];
    }

    if (!isEmpty(errors)) {
      throw new AppError({
        id: 'UserService.registerBySocial',
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'INVALID_BODY',
        errors,
      });
    }

    const user = await UserRepository.registerByAccount(provider, data);

    return user;
  }
}
