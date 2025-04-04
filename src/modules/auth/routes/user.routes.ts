import { Router } from 'express';
import passport from 'passport';

import { validate } from '~/middlewares/validate';
import { UserController } from '../controllers/user.controller';
import { loginUserSchema, registerUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/register', validate(registerUserSchema), UserController.register);
router.post('/login', validate(loginUserSchema), UserController.login);
router.get('/@me', passport.authenticate('jwt', { session: false }), UserController.getMe);

// localhost:5000/api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  UserController.callbackSocial,
);

export default router;
