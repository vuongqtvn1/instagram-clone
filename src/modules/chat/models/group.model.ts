import mongoose from 'mongoose';

// members: Danh sách thành viên
// isGroup: Xác định đây là nhóm hay cuộc trò chuyện riêng
// lastMessage: Tin nhắn cuối cùng trong cuộc trò chuyện

const GroupChatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true },
);

export const GroupModel = mongoose.model('GroupMessage', GroupChatSchema);
