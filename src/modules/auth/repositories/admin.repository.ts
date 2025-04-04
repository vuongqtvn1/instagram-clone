import { CreateAdminDTO } from '../dtos/admin.dto';
import { AdminModel, IUserAdmin } from '../models/admin.model';

export class AdminRepository {
  static async getByKey(key: keyof IUserAdmin, value: any) {
    return AdminModel.findOne({ [key]: value }).lean();
  }

  static async getByEmail(email: string) {
    return AdminModel.findOne({ email }).lean();
  }

  static async getById(userId: string) {
    return AdminModel.findById(userId, '-password').lean();
  }

  static async create(data: CreateAdminDTO) {
    const user = await AdminModel.create({ ...data });
    return user.toObject();
  }
}
