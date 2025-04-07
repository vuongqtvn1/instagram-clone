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

  static async follow(userId: string, followerUserId: string) {
    // Thêm user follower vào danh sách following của user hiện tại
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { followings: followerUserId } },
      { new: true },
    ).lean();

    // Thêm user hiện tại vào danh sách followers của user follower
    await UserModel.findByIdAndUpdate(
      followerUserId,
      { $push: { followers: userId } },
      { new: true },
    ).lean();
  }

  static async unfollow(userId: string, unfollowedUserId: string) {
    // Xoá user follower vào danh sách following của user hiện tại
    // filter
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { followings: unfollowedUserId } },
      { new: true },
    ).lean();

    // Xoá user hiện tại vào danh sách followers của user follower
    await UserModel.findByIdAndUpdate(
      unfollowedUserId,
      { $pull: { followers: userId } },
      { new: true },
    ).lean();
  }

  static async getFollowers(userId: string) {
    return UserModel.findById(userId).populate('followers', 'username name email avatar').lean();
  }

  static async getFollowings(userId: string) {
    return UserModel.findById(userId).populate('followings', 'username name email avatar').lean();
  }
}
