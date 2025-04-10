import { StatusCodes } from 'http-status-codes';
import { AppError } from '~/utils/app-error';
import { CreatePostDTO, UpdatePostDTO } from '../dtos/post.dto';
import { PostRepository } from '../repositories/post.repository';

export class PostService {
  // Lấy danh sách bài viết hoặc reels
  static getList = async () => {
    const posts = await PostRepository.getList();

    return posts;
  };

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
}
