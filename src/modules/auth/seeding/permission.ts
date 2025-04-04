import { EPermissions } from '../models/permission.model';

export const PermissionSeeding = [
  {
    name: 'Quyền khoá quyền',
    description: 'Admin được quyền quản lý quyền admin',
    permission: EPermissions.ManageRole,
  },
  {
    name: 'Quyền khoá tài khoản',
    description: 'Admin được quyền khoá tài khoản người dùng',
    permission: EPermissions.BlockedUser,
  },
  {
    name: 'Quyền khoá bài viết',
    description: 'Admin được quyền khoá bài viết người dùng',
    permission: EPermissions.BlockedPost,
  },
];
