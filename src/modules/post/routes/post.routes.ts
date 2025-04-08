import { Router } from 'express';

import passport from 'passport';
import { validate } from '~/middlewares/validate';
import { PostController } from '../controllers/post.controller';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';
import { CommentController } from '../controllers/comment.controller';

const router = Router();

// get bai viet theo followings => ngau nhien
router.get('/', passport.authenticate('jwt', { session: false }), PostController.getByFollowings);

// get bai viet ngau nhien
router.get('/explore', passport.authenticate('jwt', { session: false }), PostController.getExplore);

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

// lay danh sach comment
router.get(
  '/:id/comments',
  passport.authenticate('jwt', { session: false }),
  CommentController.getListByPost,
);

// like post
router.put('/:id/like', passport.authenticate('jwt', { session: false }), PostController.likePost);

// unlike post
router.put(
  '/:id/unlike',
  passport.authenticate('jwt', { session: false }),
  PostController.unlikePost,
);
// save post
router.put('/:id/save', passport.authenticate('jwt', { session: false }), PostController.savePost);
// unsave post
router.put(
  '/:id/unsave',
  passport.authenticate('jwt', { session: false }),
  PostController.unSavePost,
);

export default router;
