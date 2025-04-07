import { ConfigEnvironment } from '~/config/env';
import { logger } from '~/config/logger';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';
import { PermissionModel } from '../models/permission.model';
import { RoleModel } from '../models/role.model';
import { AdminSeeding, PermissionSeeding, RoleSeeding } from '../seeding/permission';
import { AdminModel } from '../models/admin.model';

export class RoleRepository {
  static async seedingDB() {
    const promises: Promise<any>[] = [];
    if (ConfigEnvironment.seedingPermission) {
      PermissionSeeding.forEach((item) => {
        promises.push(
          PermissionModel.findOneAndUpdate({ permission: item.permission }, item, { upsert: true }),
        );
      });

      RoleSeeding.forEach((item) => {
        promises.push(RoleModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true }));
      });

      AdminSeeding.forEach((item) => {
        promises.push(AdminModel.findOneAndUpdate({ _id: item._id }, item, { upsert: true }));
      });

      await Promise.all(promises);
      logger.info('Seeding permission successfully');
    }
  }

  static async getPermissions() {
    return PermissionModel.find().lean();
  }

  static async getRoles() {
    return RoleModel.find().lean();
  }

  static async getRoleById(id: string) {
    return RoleModel.findById(id).lean();
  }

  static async createRole(data: CreateRoleDTO) {
    const result = await RoleModel.create({ ...data, buildIn: false });
    return result.toObject();
  }

  static async updateRole(id: string, data: UpdateRoleDTO) {
    const result = await RoleModel.findOneAndUpdate({ _id: id, buildIn: false }, data, {
      new: true,
    }).lean();

    return result;
  }

  static async deleteRole(id: string) {
    const result = await RoleModel.findOneAndDelete({
      _id: id,
      buildIn: false,
    }).lean();

    return result;
  }
}
