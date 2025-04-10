import { Router } from 'express';

import passport from 'passport';
import { validate } from '~/middlewares/validate';
import { CommentController } from '../controllers/comment.controller';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.validator';

const router = Router();

// tao binh luan
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate(createCommentSchema),
  CommentController.create,
);

// sua binh luan
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validate(updateCommentSchema),
  CommentController.update,
);

// xoa binh luan
router.delete('/:id', passport.authenticate('jwt', { session: false }), CommentController.delete);

export default router;
