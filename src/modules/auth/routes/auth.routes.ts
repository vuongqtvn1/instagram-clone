import { Router } from 'express';
import passport from 'passport';

import { validate } from '~/middlewares/validate';
import { AuthController } from '../controllers/auth.controller';
import { IUser } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/@me', passport.authenticate('jwt', { session: false }), AuthController.getMe);

// localhost:5000/api/auth/google

// Social Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const user = req.user as IUser;
  const token = AuthService.generateToken(user);

  // redirect web user token jsonwebtoken => get me /@me by token login
  res.redirect(`http://localhost:5173/profile?token=${token}`);
});

export default router;
