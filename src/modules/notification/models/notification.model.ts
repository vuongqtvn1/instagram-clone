import mongoose from 'mongoose';

export enum NotificationType {
  FOLLOW_USER = 'follow-user',
  LIKE_POST = 'like-post',
  LIKE_COMMENT = 'like-comment',
  COMMENT = 'comment',
  REPLY_COMMENT = 'reply-comment',
  SEND_MESSAGE = 'send-message',
}

const NotificationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    type: {
      type: String,
      enum: [
        'follow-user',
        'like-post',
        'like-comment',
        'comment',
        'reply-comment',
        'send-message',
      ],
      required: true,
    },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const NotificationModel = mongoose.model('Notification', NotificationSchema);
