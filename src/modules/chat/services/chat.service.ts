import { ChatModel } from '../models/chat.model';
import { MessageModel } from '../models/message.model';

export class CommentService {
  createChat = async (senderId: string, receiveId: string) => {
    const existingChat = await ChatModel.findOne({ members: { $all: [receiveId, senderId] } });

    if (existingChat) return existingChat;

    const newChat = await ChatModel.create({ members: [receiveId, senderId] });

    return newChat;
  };

  getUserChats = async (userId: string) => {
    const chats = await ChatModel.find({ members: userId })
      .populate('members', 'username avatar')
      .populate('lastMessage');

    return chats;
  };

  sendMessage = async (senderId: string, data: any) => {
    const { chatId, text, image } = data;

    const message = await MessageModel.create({ chatId, sender: senderId, text, image });

    await ChatModel.findByIdAndUpdate(chatId, { lastMessage: message._id });

    // io.to(chatId).emit('newMessage', message); // Gửi tin nhắn đến chatId

    return message;
  };
}
