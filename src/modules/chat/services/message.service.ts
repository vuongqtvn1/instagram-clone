import { StatusCodes } from 'http-status-codes';
import { MessageFilters, SendMessageDTO, UpdateMessageDTO } from '../dtos/message.dto';
import { AppError } from '~/utils/app-error';
import { GroupService } from './group.service';
import { MessageRepository } from '../repositories/message.repository';
import { NotificationService } from '~/modules/notification/services/notifaction.service';
import { NotificationType } from '~/modules/notification/models/notification.model';
import { sendNotifyToWS } from '~/config/ws';

export class MessageService {
  // send message to group
  static sendMessage = async (senderId: string, data: SendMessageDTO) => {
    const { groupId, images, replyId, text, videos } = data;

    if (!text && !images?.length && !videos?.length) {
      throw new AppError({
        id: 'MessageService.sendMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    const group = await GroupService.getByGroupId(groupId);

    if (!group) {
      throw new AppError({
        id: 'MessageService.sendMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có cuộc trò chuyện này',
      });
    }

    const memberIds = group.members.map((id) => String(id));

    if (!memberIds.includes(senderId)) {
      throw new AppError({
        id: 'GroupService.create',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có quyền gửi tin nhắn',
      });
    }

    if (replyId) {
      const messageReply = await MessageRepository.getById(replyId);

      if (!messageReply || messageReply.groupId.toString() !== groupId) {
        throw new AppError({
          id: 'MessageService.sendMessage',
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Tin nhắn này không tồn tại',
        });
      }
    }

    const message = await MessageRepository.create(senderId, {
      groupId,
      images,
      replyId,
      text,
      videos,
    });

    const notification = await NotificationService.create({
      sender: senderId,
      receiver: memberIds,
      type: NotificationType.SEND_MESSAGE,
      targetId: String(message?._id),
    });

    sendNotifyToWS(memberIds, notification);

    return message;
  };

  // get message by condition
  static getMessages = async (userId: string, filters: MessageFilters) => {
    const { data, totalData } = await MessageRepository.getPagination(filters);

    const messages = data.map((item) => ({
      ...item,
      fromSelf: userId === String(item.sender),
    }));

    return { data: messages, totalData };
  };

  // update message
  static updateMessage = async (messageId: string, senderId: string, data: UpdateMessageDTO) => {
    const { images, text, videos } = data;

    if (!text && !images?.length && !videos?.length) {
      throw new AppError({
        id: 'MessageService.sendMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    const message = await MessageRepository.getById(messageId);

    if (!message) {
      throw new AppError({
        id: 'MessageService.updateMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có tin nhắn này',
      });
    }

    if (message.sender.toString() !== senderId) {
      throw new AppError({
        id: 'MessageService.updateMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có quyền sửa tin nhắn',
      });
    }

    const updateMessage = await MessageRepository.update(messageId, senderId, {
      images,
      text,
      videos,
    });

    // gửi socket đến những user đang online trong cái nhóm message này

    return updateMessage;
  };

  // delete message
  static deleteMessage = async (messageId: string, senderId: string) => {
    const message = await MessageRepository.getById(messageId);

    if (!message) {
      throw new AppError({
        id: 'MessageService.deleteMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có tin nhắn này',
      });
    }

    if (message.sender.toString() !== senderId) {
      throw new AppError({
        id: 'MessageService.deleteMessage',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có quyền xoá tin nhắn',
      });
    }

    const result = await MessageRepository.delete(messageId, senderId);

    // gửi socket đến những user đang online trong cái nhóm message này

    return result;
  };
}
