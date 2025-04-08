import { isArray, isBoolean } from 'lodash';
import { UserModel } from '~/modules/account/models/user.model';
import { BaseRepository } from '~/utils/repository';
import { CreatePostDTO, PostFilters, UpdatePostDTO } from '../dtos/post.dto';
import { PostModel } from '../models/post.model';

export class PostRepository {
  static getQuery(filters: PostFilters) {
    const condition: Record<string, any> = {};

    if (isArray(filters.createdBy) && filters.createdBy.length) {
      condition.createdBy = {
        $in: filters.createdBy,
      };
    }

    if (isArray(filters.savedBy) && filters.savedBy.length) {
      condition.savedBy = {
        $in: filters.savedBy,
      };
    }

    if (isArray(filters.excludes) && filters.excludes.length) {
      condition._id = {
        $nin: filters.excludes,
      };
    }

    if (isBoolean(filters.isReel)) {
      condition.isReel = filters.isReel;
    }

    return condition;
  }

  static async getExplore(filters: PostFilters) {
    const condition = PostRepository.getQuery(filters);
    const { paginate } = BaseRepository.getQuery(filters);

    const [data, totalData] = await Promise.all([
      PostModel.aggregate([{ $match: condition }, { $sample: { size: paginate.limit } }]),
      PostModel.find(condition).countDocuments(),
    ]);

    return { data, totalData };
  }

  static async getPagination(filters: PostFilters) {
    const condition = PostRepository.getQuery(filters);

    return BaseRepository.getPagination(PostModel, condition, filters);
  }

  static async getById(id: string) {
    return PostModel.findById(id).lean();
  }

  static async create(createdBy: string, data: CreatePostDTO) {
    const result = await PostModel.create({ ...data, createdBy });
    return result.toObject();
  }

  static async update(postId: string, data: UpdatePostDTO) {
    const result = await PostModel.findByIdAndUpdate(postId, data, { new: true }).lean();

    return result;
  }

  static async delete(id: string, createdBy: string) {
    const result = await PostModel.findOneAndDelete({ _id: id, createdBy }).lean();

    return result;
  }

  static async commentPost(postId: string, commentId: string) {
    const result = await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: commentId },
    }).lean();

    return result;
  }

  static async removeCommentPost(postId: string, commentId: string) {
    const result = await PostModel.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    }).lean();

    return result;
  }

  static async likePost(postId: string, userLike: string) {
    const result = await PostModel.findByIdAndUpdate(postId, {
      $push: { likes: userLike },
    }).lean();

    return result;
  }

  static async unlikePost(postId: string, userUnlike: string) {
    const result = await PostModel.findByIdAndUpdate(postId, {
      $pull: { likes: userUnlike },
    }).lean();

    return result;
  }

  static async savePost(postId: string, userSave: string) {
    const result = await PostModel.findByIdAndUpdate(postId, {
      $push: { savedBy: userSave },
    }).lean();

    await UserModel.findByIdAndUpdate(userSave, {
      $push: { saved: postId },
    }).lean();

    return result;
  }

  static async unSavePost(postId: string, userUnsave: string) {
    const result = await PostModel.findByIdAndUpdate(postId, {
      $pull: { savedBy: userUnsave },
    }).lean();

    await UserModel.findByIdAndUpdate(userUnsave, {
      $pull: { saved: postId },
    }).lean();

    return result;
  }
}
