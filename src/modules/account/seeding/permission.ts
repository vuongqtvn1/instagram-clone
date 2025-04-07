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
  {
    name: 'Quyền khoá tài khoản admin',
    description: 'Admin được quyền quản lý tài khoản admin',
    permission: EPermissions.ManageAdmin,
  },
];

export const AdminSeeding = [
  {
    _id: '67f37001bf977e4e676cc153',
    name: 'Duong Vuong',
    email: 'quocvuongta1023@gmail.com',
    password: '$2b$10$9R57OBx4PZ31am2CYJw6qunHtAYCwDaCav0ZWAmBkwUI79xrVP9ti',
    role: '67f36f5f00ab68ad2c970ba7',
    buildIn: true,
  },
];

export const RoleSeeding = [
  {
    _id: '67f36f5f00ab68ad2c970ba7',
    name: 'Quản trị hệ thống',
    description: 'Admin được quyền quản lý hệ thống',
    permissions: [
      EPermissions.ManageRole,
      EPermissions.BlockedUser,
      EPermissions.BlockedPost,
      EPermissions.ManageAdmin,
    ],
    buildIn: true,
  },
];
