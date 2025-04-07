import { Router } from 'express';

import { authAdminMiddleware, checkPermissionMiddleware } from '~/middlewares/auth-admin';
import { validate } from '~/middlewares/validate';
import { AdminController } from '../controllers/admin.controller';
import { createAdminSchema, loginAdminSchema } from '../validators/admin.validator';
import { EPermissions } from '../models/permission.model';

const router = Router();

router.post(
  '/',
  authAdminMiddleware,
  checkPermissionMiddleware(EPermissions.ManageAdmin),
  validate(createAdminSchema),
  AdminController.create,
);
router.post('/login', validate(loginAdminSchema), AdminController.login);
router.get('/@me', authAdminMiddleware, AdminController.getMe);

export default router;
