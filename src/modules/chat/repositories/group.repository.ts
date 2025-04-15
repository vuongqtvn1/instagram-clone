import { BaseRepository } from '~/utils/repository';
import { CreateGroupDTO, GroupMessageFilters } from '../dtos/group.dto';
import { GroupModel } from '../models/group.model';

export class GroupRepository {
  static getNotifications = async (receiverId: string) => {
    const notifications = await GroupModel.find({ receiver: receiverId })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    return notifications;
  };

  static getQuery(filters: GroupMessageFilters) {
    const condition: Record<string, any> = {};

    if (filters.userId) {
      condition.$or = [
        {
          createdBy: filters.userId,
        },
        { members: { $in: [filters.userId] } },
      ];
    }

    if (filters.keyword) {
      condition.groupName = { $regex: new RegExp(filters.keyword, 'i') };
    }

    return condition;
  }

  static async getPagination(filters: GroupMessageFilters) {
    const condition = GroupRepository.getQuery(filters);
    const { paginate, sort } = BaseRepository.getQuery(filters);

    const [data, totalData] = await Promise.all([
      GroupModel.find(condition)
        .sort(sort)
        .populate('members', 'username email name avatar')
        .populate('createdBy', 'username email name avatar')
        .skip(paginate.skip)
        .limit(paginate.limit)
        .lean(),
      GroupModel.find(condition).countDocuments(),
    ]);

    return { data, totalData };
  }

  static getByGroupId = async (groupId: string) => {
    const result = await GroupModel.findById(groupId).lean();

    return result;
  };

  static checkExistedPrivate = async (members: string[]) => {
    const existingGroup = await GroupModel.findOne({
      members: { $all: members },
      isGroup: false,
    }).lean();

    return existingGroup;
  };

  static createGroup = async (createdBy: string, data: CreateGroupDTO) => {
    const newGroup = await GroupModel.create({
      members: data.members,
      isGroup: data.isGroup,
      createdBy,
    });

    return newGroup.toObject();
  };

  static updateMembersGroup = async (groupId: string, members: string[]) => {
    const result = await GroupModel.findByIdAndUpdate(groupId, { members }, { new: true }).lean();

    return result;
  };

  static deleteGroup = async (groupId: string, createdBy: string) => {
    const result = await GroupModel.findOneAndDelete({ _id: groupId, createdBy }).lean();

    return result;
  };

  static getUserChats = async (userId: string) => {
    const chats = await GroupModel.find({ members: userId })
      .populate('members', 'username avatar')
      .populate('lastMessage');

    return chats;
  };

  static sendMessage = async (senderId: string, data: any) => {
    const { chatId, text, image } = data;

    const message = await GroupModel.create({ chatId, sender: senderId, text, image });

    await GroupModel.findByIdAndUpdate(chatId, { lastMessage: message._id });

    // io.to(chatId).emit('newMessage', message); // Gửi tin nhắn đến chatId

    return message;
  };
}
