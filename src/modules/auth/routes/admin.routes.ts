import { Router } from 'express';

import { authAdminMiddleware } from '~/middlewares/auth-admin';
import { validate } from '~/middlewares/validate';
import { AdminController } from '../controllers/admin.controller';
import { createAdminSchema, loginAdminSchema } from '../validators/admin.validator';

const router = Router();

router.post('/', validate(createAdminSchema), AdminController.create);
router.post('/login', validate(loginAdminSchema), AdminController.login);
router.get('/@me', authAdminMiddleware, AdminController.getMe);

export default router;
