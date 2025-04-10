import { isArray } from 'lodash';
import { CommentFilters, CreateCommentDTO, UpdateCommentDTO } from '../dtos/comment.dto';
import { CommentModel } from '../models/comment.model';
import { BaseRepository } from '~/utils/repository';

export class CommentRepository {
  static getQuery(filters: CommentFilters) {
    const condition: Record<string, any> = { parentCommentId: null };

    if (isArray(filters.createdBy) && filters.createdBy.length) {
      condition.createdBy = {
        $in: filters.createdBy,
      };
    }

    if (isArray(filters.parentComments) && filters.parentComments.length) {
      condition.parentCommentId = {
        $in: filters.parentComments,
      };
    }

    if (isArray(filters.posts) && filters.posts.length) {
      condition.post = {
        $in: filters.posts,
      };
    }

    return condition;
  }

  static async getPagination(filters: CommentFilters) {
    const condition = CommentRepository.getQuery(filters);
    const { paginate, sort } = BaseRepository.getQuery(filters);

    const [data, totalData] = await Promise.all([
      CommentModel.find(condition)
        .sort(sort)
        .populate('createdBy', 'username email name avatar')
        .skip(paginate.skip)
        .limit(paginate.limit)
        .lean(),
      CommentModel.find(condition).countDocuments(),
    ]);

    return { data, totalData };
  }

  static async getById(id: string) {
    return CommentModel.findById(id).lean();
  }

  static async createPostComment(createdBy: string, data: CreateCommentDTO) {
    const result = await CommentModel.create({
      ...data,
      post: data.postId,
      createdBy,
    });

    return result.toObject();
  }

  static async reply(payload: {
    createdBy: string;
    postId: string;
    parentCommentId: string;
    content: string;
  }) {
    const { content, createdBy, parentCommentId, postId } = payload;
    const result = await CommentModel.create({ createdBy, post: postId, content, parentCommentId });

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

  static async removeReplies(parentCommentId: string, commentRemoveId: string) {
    const result = await CommentModel.findByIdAndUpdate(parentCommentId, {
      $pull: { replies: commentRemoveId },
    }).lean();

    return result;
  }

  static async likeComment(commentId: string, userLike: string) {
    const result = await CommentModel.findByIdAndUpdate(commentId, {
      $push: { likes: userLike },
    }).lean();

    return result;
  }

  static async unlikeComment(commentId: string, userUnlike: string) {
    const result = await CommentModel.findByIdAndUpdate(commentId, {
      $pull: { likes: userUnlike },
    }).lean();

    return result;
  }
}
