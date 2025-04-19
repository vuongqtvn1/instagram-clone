import { NotificationType } from '../models/notification.model';
import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  static create = async (data: {
    sender: string;
    receiver: string[];
    type: NotificationType;
    targetId: string;
  }) => {
    const result = await NotificationRepository.create(data);

    return result;
  };
}
