import { BaseRepository } from '~/utils/repository';
import { MessageFilters, SendMessageDTO } from '../dtos/message.dto';
import { MessageModel } from '../models/message.model';

export class MessageRepository {
  static getQuery(filters: MessageFilters) {
    const condition: Record<string, any> = {};

    if (filters.groupId) {
      condition.groupId = filters.groupId;
    }

    return condition;
  }

  static async getPagination(filters: MessageFilters) {
    const condition = MessageRepository.getQuery(filters);
    const { paginate, sort } = BaseRepository.getQuery(filters);

    const [data, totalData] = await Promise.all([
      MessageModel.find(condition)
        .sort(sort)
        .populate('sender')
        .populate('replyMessage')
        .populate('seenBy', 'username email name avatar')
        .skip(paginate.skip)
        .limit(paginate.limit)
        .lean(),
      MessageModel.find(condition).countDocuments(),
    ]);

    return { data, totalData };
  }

  static async getList() {
    return MessageModel.find().populate('sender').lean();
  }

  static async getById(id: string) {
    return MessageModel.findById(id).populate('sender').lean();
  }

  static async create(sender: string, data: SendMessageDTO) {
    const result = await MessageModel.create({ ...data, sender });

    return this.getById(String(result.toObject()._id));
  }

  static async update(
    messageId: string,
    senderId: string,
    data: Pick<SendMessageDTO, 'images' | 'text' | 'videos'>,
  ) {
    const result = await MessageModel.findOneAndUpdate(
      {
        _id: messageId,
        sender: senderId,
      },
      { ...data },
      { new: true },
    ).lean();

    return result;
  }

  static async delete(messageId: string, senderId: string) {
    const result = await MessageModel.findOneAndDelete({ _id: messageId, sender: senderId }).lean();

    return result;
  }
}
