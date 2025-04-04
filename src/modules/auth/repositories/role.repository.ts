import { ConfigEnvironment } from '~/config/env';
import { logger } from '~/config/logger';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';
import { PermissionModel } from '../models/permission.model';
import { RoleModel } from '../models/role.model';
import { PermissionSeeding } from '../seeding/permission';

export class RoleRepository {
  static async seedingDB() {
    if (ConfigEnvironment.seedingPermission) {
      const promises = PermissionSeeding.map((item) => {
        return PermissionModel.findOneAndUpdate({ permission: item.permission }, item, {
          upsert: true,
        });
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
    const result = await RoleModel.create(data);
    return result.toObject();
  }

  static async updateRole(id: string, data: UpdateRoleDTO) {
    const result = await RoleModel.findByIdAndUpdate(id, data, { new: true }).lean();

    return result;
  }

  static async deleteRole(id: string) {
    const result = await RoleModel.findByIdAndDelete(id).lean();

    return result;
  }
}
