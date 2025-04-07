import { Router } from 'express';

import { authAdminMiddleware, checkPermissionMiddleware } from '~/middlewares/auth-admin';
import { validate } from '~/middlewares/validate';
import { roleSchema } from '../validators/role.validator';
import { EPermissions } from '../models/permission.model';
import { RoleController } from '../controllers/role.controller';

const router = Router();

router.get(
  '/',
  authAdminMiddleware,
  checkPermissionMiddleware(EPermissions.ManageRole),
  RoleController.getRoles,
);

router.get(
  '/permissions',
  authAdminMiddleware,
  checkPermissionMiddleware(EPermissions.ManageRole),
  RoleController.getPermissions,
);

router.post(
  '/',
  authAdminMiddleware,
  checkPermissionMiddleware(EPermissions.ManageRole),
  validate(roleSchema),
  RoleController.createRole,
);

router.put(
  '/:id',
  authAdminMiddleware,
  checkPermissionMiddleware(EPermissions.ManageRole),
  validate(roleSchema),
  RoleController.updateRole,
);

router.delete(
  '/:id',
  authAdminMiddleware,
  checkPermissionMiddleware(EPermissions.ManageRole),
  RoleController.deleteRole,
);

export default router;
