import { NotificationModel, NotificationType } from '../models/notification.model';

export class NotificationRepository {
  static getNotifications = async (receiverId: string) => {
    const notifications = await NotificationModel.find({ receiver: receiverId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    return notifications;
  };

  static create = async (data: {
    sender: string;
    receiver: string[];
    type: NotificationType;
    targetId: string;
  }) => {
    const result = await NotificationModel.create(data);

    return result.toObject();
  };
}
