import { Router } from 'express';

import passport from 'passport';
import { validate } from '~/middlewares/validate';
import { CommentController } from '../controllers/comment.controller';
import {
  createCommentSchema,
  replyCommentSchema,
  updateCommentSchema,
} from '../validators/comment.validator';

const router = Router();

// tao binh luan
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate(createCommentSchema),
  CommentController.create,
);

router.post(
  '/reply',
  passport.authenticate('jwt', { session: false }),
  validate(replyCommentSchema),
  CommentController.reply,
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
