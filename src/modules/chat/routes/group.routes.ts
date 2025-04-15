import { Router } from 'express';

import passport from 'passport';
import { validate } from '~/middlewares/validate';
import { GroupController } from '../controllers/group.controller';
import { createGroupSchema, updateGroupMemberSchema } from '../validators/group.validator';

const router = Router();

// lay nhom chat cua thang dang dang nhap
router.get('/', passport.authenticate('jwt', { session: false }), GroupController.getGroups);

// tao nhom chat (loai group chat, ca nhan)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate(createGroupSchema),
  GroupController.create,
);

// them thanh vien vao nhom chat (phai co isGroup = true)
router.put(
  '/:groupId/add-member',
  passport.authenticate('jwt', { session: false }),
  validate(updateGroupMemberSchema),
  GroupController.addMember,
);

// xoa thanh vien vao nhom chat (phai co isGroup = true)
router.put(
  '/:groupId/remove-member',
  passport.authenticate('jwt', { session: false }),
  validate(updateGroupMemberSchema),
  GroupController.removeMember,
);

// xoa  nhom chat
router.delete(
  '/:groupId',
  passport.authenticate('jwt', { session: false }),
  GroupController.delete,
);

export default router;
