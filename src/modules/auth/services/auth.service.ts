import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { ConfigEnvironment } from '~/config/env';
import { LoginDTO, RegisterDTO } from '../dtos/auth.dto';
import { EAuthProvider, IUser } from '../models/auth.model';
import { AuthRepository } from '../repositories/auth.repository';
import { AppError } from '~/utils/app-error';

export class AuthService {
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
    const user = await AuthRepository.getById(userId);

    return user;
  }

  static async getByProvider(provider: EAuthProvider, providerId: string) {
    const user = await AuthRepository.getByProvider(provider, providerId);

    return user;
  }

  static async getMe(userId: string) {
    // b1. check user exist
    const user = await AuthRepository.getById(userId);

    if (!user) {
      throw new AppError({
        id: 'AuthService.getMe',
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
    const existingUser = await AuthRepository.getByEmail(data.email);

    if (existingUser) {
      throw new AppError({
        id: 'AuthService.registerByAccount',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'EMAIL_EXISTED',
        errors: { email: [{ id: 'EMAIL_EXISTED', message: 'EMAIL_EXISTED' }] },
      });
    }

    // b2. hashing password => saving database user
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    const user = await AuthRepository.registerByAccount({
      ...data,
      password: passwordHash,
    });

    // b3. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async loginByAccount(data: LoginDTO) {
    // b1. check user exist
    const user = await AuthRepository.getByEmail(data.email);

    if (!user) {
      throw new AppError({
        id: 'AuthService.loginByAccount',
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
        id: 'AuthService.loginByAccount',
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

  static async registerBySocial(payload: {
    data: RegisterDTO;
    provider: EAuthProvider;
    providerId: string;
  }) {
    const { data, provider, providerId } = payload;

    const userSocial = await this.getByProvider(provider, providerId);

    // exist user provider
    if (userSocial) {
      return userSocial;
    }

    // not account social
    // b1. check user exist
    const existUser = await AuthRepository.getByEmail(data.email);

    if (existUser) {
      throw new AppError({
        id: 'AuthService.registerBySocial',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'EMAIL_EXISTED',
      });
    }

    // b2. create user
    const user = await AuthRepository.registerBySocial({
      data,
      provider,
      providerId,
    });

    return user;
  }
}
