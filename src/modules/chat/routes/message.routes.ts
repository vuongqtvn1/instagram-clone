import { Router } from 'express';

import passport from 'passport';
import { MessageController } from '../controllers/message.controller';
import { validate } from '~/middlewares/validate';
import { sendMessageSchema, updateMessageSchema } from '../validators/message.validator';

const router = Router();

// gui tin nhan (gui tin nhan binh thuong,  gui tin nhan reply (co them reply id message))
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate(sendMessageSchema),
  MessageController.sendMessage,
);

router.get('/', passport.authenticate('jwt', { session: false }), MessageController.getMessages);

// sua tin nhan
router.put(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  validate(updateMessageSchema),
  MessageController.update,
);

// xoa tin nhan
router.delete(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  MessageController.delete,
);

export default router;
