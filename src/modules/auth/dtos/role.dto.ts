// Data Transfer Object (DTO)

import { EPermissions } from '../models/permission.model';

export interface CreateRoleDTO {
  name: string;
  permissions: EPermissions[];
}

export interface UpdateRoleDTO {
  name: string;
  permissions: EPermissions[];
}
