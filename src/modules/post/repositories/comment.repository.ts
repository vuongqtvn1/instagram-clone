import { CreateCommentDTO, UpdateCommentDTO } from '../dtos/comment.dto';
import { CommentModel } from '../models/comment.model';

export class CommentRepository {
  static async getListByPost(postId: string) {
    return CommentModel.find({ post: postId })
      .populate('createdBy', 'username email name avatar')
      .lean();
  }

  static async getById(id: string) {
    return CommentModel.findById(id).lean();
  }

  static async create(createdBy: string, data: CreateCommentDTO) {
    const result = await CommentModel.create({ ...data, post: data.postId, createdBy });

    return result.toObject();
  }

  static async reply(payload: {
    createdBy: string;
    postId: string;
    parentCommentId: string;
    content: string;
  }) {
    const { content, createdBy, parentCommentId, postId } = payload;
    const result = await CommentModel.create({ createdBy, post: postId, content });

    const replyComment = result.toObject();

    await CommentModel.findByIdAndUpdate(parentCommentId, {
      $push: { replies: replyComment._id },
    });

    return replyComment;
  }

  static async update(id: string, data: UpdateCommentDTO) {
    const result = await CommentModel.findByIdAndUpdate(id, data, { new: true }).lean();

    return result;
  }

  static async delete(id: string, createdBy: string) {
    const result = await CommentModel.findOneAndDelete({ _id: id, createdBy }).lean();

    return result;
  }
}
