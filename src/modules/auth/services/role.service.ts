import { StatusCodes } from 'http-status-codes';
import { AppError } from '~/utils/app-error';
import { EPermissions } from '../models/permission.model';
import { AdminRepository } from '../repositories/admin.repository';
import { RoleRepository } from '../repositories/role.repository';
import { CreateRoleDTO, UpdateRoleDTO } from '../dtos/role.dto';

export class RoleService {
  static async checkPermission(userId: string, permission: EPermissions) {
    const user = await AdminRepository.getById(userId);

    if (!user || !user.role) {
      throw new AppError({
        id: 'RoleService.checkPermission',
        statusCode: StatusCodes.FORBIDDEN,
        message: 'FORBIDDEN',
      });
    }

    const role = await RoleRepository.getRoleById(String(user.role));

    if (!role || !role.permissions.includes(permission)) {
      throw new AppError({
        id: 'RoleService.checkPermission',
        statusCode: StatusCodes.FORBIDDEN,
        message: 'FORBIDDEN',
      });
    }

    return user;
  }

  static async getRoles() {
    return RoleRepository.getRoles();
  }

  static async getRoleById(id: string) {
    return RoleRepository.getRoleById(id);
  }

  static async createRole(data: CreateRoleDTO) {
    return RoleRepository.createRole(data);
  }

  static async updateRole(id: string, data: UpdateRoleDTO) {
    const role = await RoleRepository.getRoleById(id);

    if (!role) {
      throw new AppError({
        id: 'RoleService.updateRole',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'NOTFOUND',
      });
    }

    return RoleRepository.updateRole(id, data);
  }

  static async deleteRole(id: string) {
    const role = await RoleRepository.getRoleById(id);

    if (!role) {
      throw new AppError({
        id: 'RoleService.updateRole',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'NOTFOUND',
      });
    }

    return RoleRepository.deleteRole(id);
  }

  static async getPermissions() {
    return RoleRepository.getPermissions();
  }
}
