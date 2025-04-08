import { StatusCodes } from 'http-status-codes';
import { AppError } from '~/utils/app-error';
import { CreatePostDTO, PostFilters, UpdatePostDTO } from '../dtos/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { UserService } from '~/modules/account/services/user.service';

export class PostService {
  // Tạo bài viết hoặc reels
  static create = async (createdBy: string, data: CreatePostDTO) => {
    const { media } = data;

    if (!media || media.length === 0) {
      throw new AppError({
        id: 'PostService.create',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Phải có ít nhất 1 ảnh/video!',
      });
    }

    const post = await PostRepository.create(createdBy, data);

    return post;
  };

  // Cập nhập bài viết hoặc reels
  static update = async (payload: { postId: string; data: UpdatePostDTO; createdBy: string }) => {
    const { createdBy, data, postId } = payload;

    if (!data.media || data.media.length === 0) {
      throw new AppError({
        id: 'PostService.update',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Phải có ít nhất 1 ảnh/video!',
      });
    }

    const olderPost = await PostRepository.getById(postId);

    if (!olderPost) {
      throw new AppError({
        id: 'PostService.update',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    if (String(olderPost.createdBy) !== createdBy) {
      throw new AppError({
        id: 'PostService.update',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có đăng bài viết này',
      });
    }

    const post = await PostRepository.update(postId, data);

    return post;
  };

  // Cập nhập bài viết hoặc reels
  static delete = async (payload: { postId: string; createdBy: string }) => {
    const { createdBy, postId } = payload;

    const olderPost = await PostRepository.getById(postId);

    if (!olderPost) {
      throw new AppError({
        id: 'PostService.delete',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    if (String(olderPost.createdBy) !== createdBy) {
      throw new AppError({
        id: 'PostService.delete',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có đăng bài viết này',
      });
    }

    const post = await PostRepository.delete(postId, createdBy);

    return post;
  };

  // like post/ unlike post
  static async likePost(postId: string, userLike: string) {
    const [post, user] = await Promise.all([
      PostRepository.getById(postId),
      UserService.getById(userLike),
    ]);

    if (!post) {
      throw new AppError({
        id: 'PostService.likePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    if (!user) {
      throw new AppError({
        id: 'PostService.likePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const likes = post.likes.map((id) => String(id));

    // Kiểm tra xem đã follow chưa
    const alreadyLike = likes.includes(userLike);

    if (alreadyLike) {
      throw new AppError({
        id: 'PostService.likePost',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn đã thích bài viết này rồi!',
      });
    }

    await PostRepository.likePost(postId, userLike);
  }

  static async unlikePost(postId: string, userUnlike: string) {
    const [post, user] = await Promise.all([
      PostRepository.getById(postId),
      UserService.getById(userUnlike),
    ]);

    if (!post) {
      throw new AppError({
        id: 'PostService.unlikePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    if (!user) {
      throw new AppError({
        id: 'PostService.unlikePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const likes = post.likes.map((id) => String(id));

    // Kiểm tra xem đã follow chưa
    const alreadyLike = likes.includes(userUnlike);

    if (!alreadyLike) {
      throw new AppError({
        id: 'UserService.unfollowUser',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn chưa thích bài viết này!',
      });
    }

    await PostRepository.unlikePost(postId, userUnlike);
  }

  // save post
  static async savePost(postId: string, userSave: string) {
    const [post, user] = await Promise.all([
      PostRepository.getById(postId),
      UserService.getById(userSave),
    ]);

    if (!post) {
      throw new AppError({
        id: 'PostService.savePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    if (!user) {
      throw new AppError({
        id: 'PostService.savePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const savedBy = post.savedBy.map((id) => String(id));

    // Kiểm tra xem đã follow chưa
    const alreadySave = savedBy.includes(userSave);

    if (alreadySave) {
      throw new AppError({
        id: 'PostService.savePost',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn đã lưu bài viết này!',
      });
    }

    await PostRepository.savePost(postId, userSave);
  }

  // unsave post
  static async unsavePost(postId: string, userUnsave: string) {
    const [post, user] = await Promise.all([
      PostRepository.getById(postId),
      UserService.getById(userUnsave),
    ]);

    if (!post) {
      throw new AppError({
        id: 'PostService.unsavePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    if (!user) {
      throw new AppError({
        id: 'PostService.unsavePost',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const savedBy = post.savedBy.map((id) => String(id));

    const alreadySave = savedBy.includes(userUnsave);

    if (!alreadySave) {
      throw new AppError({
        id: 'PostService.unsavePost',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn chưa lưu bài viết này!',
      });
    }

    await PostRepository.unSavePost(postId, userUnsave);
  }
  // lấy danh sách bài post theo followings
  static getPagination = async (filters: PostFilters) => {
    const result = await PostRepository.getPagination(filters);

    return result;
  };

  static getByFollowings = async (userId: string, filters: PostFilters) => {
    const user = await UserService.getById(userId);

    if (!user) {
      throw new AppError({
        id: 'PostService.getByFollowings',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const followings = user.followings.map((id) => String(id));

    const result = await this.getPagination({
      ...filters,
      createdBy: followings,
    });

    return result;
  };

  // danh sách bài viết khám phá (explore post) ngẫu nhiên
  static getExplore = async (filters: PostFilters) => {
    const result = await PostRepository.getExplore(filters);

    return result;
  };
}
