import { NotificationModel } from '../models/message.model';

export class CommentRepository {
  static getNotifications = async (receiverId: string) => {
    const notifications = await NotificationModel.find({ receiver: receiverId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    return notifications;
  };
}
