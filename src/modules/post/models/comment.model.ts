import mongoose from 'mongoose';

export interface IComment extends Document {
  content: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  replies: mongoose.Schema.Types.ObjectId[];
  parentCommentId: mongoose.Schema.Types.ObjectId;
}

// cach 2
// export interface IComment1 extends Document {
//   content: string;
//   createdBy: mongoose.Schema.Types.ObjectId;
//   post: mongoose.Schema.Types.ObjectId;
//   likes: mongoose.Schema.Types.ObjectId[];
//   commentParent: mongoose.Schema.Types.ObjectId;
// }

const CommentSchema = new mongoose.Schema<IComment>(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // preview so binh luan tra loi
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true },
);

export const CommentModel = mongoose.model('Comment', CommentSchema);
