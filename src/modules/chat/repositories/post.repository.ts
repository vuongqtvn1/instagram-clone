import { CreatePostDTO, UpdatePostDTO } from '../dtos/post.dto';
import { PostModel } from '../models/post.model';

export class PostRepository {
  static async getList() {
    return PostModel.find().lean();
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
}
