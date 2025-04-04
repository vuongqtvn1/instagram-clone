import { RegisterDTO } from '../dtos/user.dto';
import { EAuthProvider, IUser, UserModel } from '../models/user.model';

export class UserRepository {
  static async getByKey(key: keyof IUser, value: any) {
    return UserModel.findOne({ [key]: value }).lean();
  }

  static async getByEmail(email: string) {
    return UserModel.findOne({ email }).lean();
  }

  static async getById(userId: string) {
    return UserModel.findById(userId, '-password').lean();
  }

  static async getByUsernameOrEmail(usernameOrEmail: string) {
    return UserModel.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    }).lean();
  }

  static async registerByAccount(provider: EAuthProvider, data: RegisterDTO) {
    const user = await UserModel.create({ ...data, provider });
    return user.toObject();
  }
}
