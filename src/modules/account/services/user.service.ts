import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { isArray, isEmpty } from 'lodash';

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

  // Follow user
  static async followUser(userId: string, followerUserId: string) {
    if (userId === followerUserId) {
      throw new AppError({
        id: 'UserService.followUser',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không thể follow chính mình!',
      });
    }

    const [user, userToFollow] = await Promise.all([
      this.getById(userId),
      this.getById(followerUserId),
    ]);

    if (!userToFollow || !user) {
      throw new AppError({
        id: 'UserService.followUser',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const followings = user.followings.map((id) => String(id));

    // Kiểm tra xem đã follow chưa
    const alreadyFollowing = followings.includes(followerUserId);

    if (alreadyFollowing) {
      throw new AppError({
        id: 'UserService.followUser',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn đã follow người này rồi!',
      });
    }

    await UserRepository.follow(userId, followerUserId);
  }

  // Unfollow user
  static async unfollowUser(userId: string, unfollowedUserId: string) {
    if (userId === unfollowedUserId) {
      throw new AppError({
        id: 'UserService.unfollowUser',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không thể unfollow chính mình!',
      });
    }

    const [user, userToUnFollow] = await Promise.all([
      this.getById(userId),
      this.getById(unfollowedUserId),
    ]);

    if (!userToUnFollow || !user) {
      throw new AppError({
        id: 'UserService.unfollowUser',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    // Kiểm tra xem có đang follow không
    const followings = user.followings.map((id) => String(id));
    const isFollowing = followings.includes(unfollowedUserId);

    if (!isFollowing) {
      throw new AppError({
        id: 'UserService.unfollowUser',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn chưa follow người này!',
      });
    }

    await UserRepository.unfollow(userId, unfollowedUserId);
  }

  // Lấy danh sách followers
  static async getFollowers(userId: string) {
    const user = await UserRepository.getFollowers(userId);

    if (!user) {
      throw new AppError({
        id: 'UserService.getFollowers',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    return isArray(user.followers) ? user.followers : [];
  }

  // Lấy danh sách following
  static async getFollowings(userId: string) {
    const user = await UserRepository.getFollowings(userId);

    if (!user) {
      throw new AppError({
        id: 'UserService.getFollowings',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    return isArray(user.followings) ? user.followings : [];
  }
}
