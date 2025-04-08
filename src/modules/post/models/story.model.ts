import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: { type: String, required: true }, // Đường dẫn ảnh/video
    type: { type: String, enum: ['image', 'video'], required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 }, // Tự động hết hạn sau 24h
  },
  { timestamps: true },
);

export const Story = mongoose.model('Story', StorySchema);
