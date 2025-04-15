import mongoose from 'mongoose';

// chatId: Thuộc về cuộc trò chuyện nào
// sender: Ai gửi tin nhắn
// text: Nội dung tin nhắn
// image: Ảnh trong tin nhắn (nếu có)
// seenBy: Danh sách những ai đã đọc

const MessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroupMessage', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    replyMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model('Message', MessageSchema);
