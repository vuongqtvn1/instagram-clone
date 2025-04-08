import { Router } from 'express';

import passport from 'passport';
import { validate } from '~/middlewares/validate';
import { PostController } from '../controllers/post.controller';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';
import { CommentController } from '../controllers/comment.controller';

const router = Router();

// get bai viet
router.get('/', passport.authenticate('jwt', { session: false }), PostController.getList);

// tao bai viet
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate(createPostSchema),
  PostController.create,
);

// sua bai viet
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  validate(updatePostSchema),
  PostController.update,
);

// xoa bai viet
router.delete('/:id', passport.authenticate('jwt', { session: false }), PostController.delete);

router.get(
  '/:id/comments',
  passport.authenticate('jwt', { session: false }),
  CommentController.getListByPost,
);

export default router;
