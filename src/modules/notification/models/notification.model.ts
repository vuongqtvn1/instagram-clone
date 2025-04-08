import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['follow', 'like', 'comment'], required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const NotificationModel = mongoose.model('Notification', NotificationSchema);
