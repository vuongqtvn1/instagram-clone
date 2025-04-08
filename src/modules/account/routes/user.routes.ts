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

router.post(
  '/:userId/follow',
  passport.authenticate('jwt', { session: false }),
  UserController.followUser,
);
router.post(
  '/:userId/unfollow',
  passport.authenticate('jwt', { session: false }),
  UserController.unfollowUser,
);
router.get(
  '/:userId/followers',
  passport.authenticate('jwt', { session: false }),
  UserController.getFollowers,
);
router.get(
  '/:userId/followings',
  passport.authenticate('jwt', { session: false }),
  UserController.getFollowings,
);
router.get(
  '/:userId/posts',
  passport.authenticate('jwt', { session: false }),
  UserController.getPosts,
);

export default router;
