import { StatusCodes } from 'http-status-codes';
import { AppError } from '~/utils/app-error';
import { PostRepository } from '../repositories/post.repository';
import { CreateCommentDTO, UpdateCommentDTO } from '../dtos/comment.dto';
import { CommentRepository } from '../repositories/notification.repository';

export class CommentService {
  static getListByPost = async (postId: string) => {
    const comments = await CommentRepository.getListByPost(postId);

    return comments;
  };

  static create = async (createdBy: string, data: CreateCommentDTO) => {
    const { content, postId } = data;

    if (!content) {
      throw new AppError({
        id: 'CommentService.create',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Nội dung không được để trống!',
        errors: {
          content: [
            { id: 'Nội dung không được để trống!', message: 'Nội dung không được để trống!' },
          ],
        },
      });
    }

    const post = await PostRepository.getById(postId);
    if (!post) {
      throw new AppError({
        id: 'PostService.update',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bài viết không tồn tại',
      });
    }

    const comment = await CommentRepository.create(createdBy, data);

    if (data.postId) {
      await PostRepository.commentPost(data.postId, String(comment._id));
    }

    return comment;

    // // Gửi thông báo nếu người bình luận không phải chủ bài viết
    // if (post.user.toString() !== userId) {
    //   const notification = new Notification({
    //     sender: userId,
    //     receiver: post.user,
    //     type: 'comment',
    //     postId,
    //   });
    //   await notification.save();

    //   const receiverSocketId = onlineUsers.get(post.user.toString());
    //   if (receiverSocketId) {
    //     io.to(receiverSocketId).emit('new_notification', {
    //       sender: userId,
    //       type: 'comment',
    //     });
    //   }
    // }
  };

  // Cập nhập bài viết hoặc reels
  static update = async (payload: {
    commentId: string;
    data: UpdateCommentDTO;
    createdBy: string;
  }) => {
    const { createdBy, data, commentId } = payload;

    if (!data.content) {
      throw new AppError({
        id: 'CommentService.update',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Nội dung không được để trống!',
        errors: {
          content: [
            { id: 'Nội dung không được để trống!', message: 'Nội dung không được để trống!' },
          ],
        },
      });
    }

    const olderComment = await CommentRepository.getById(commentId);

    if (!olderComment) {
      throw new AppError({
        id: 'CommentService.update',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bình luận không tồn tại',
      });
    }

    if (String(olderComment.createdBy) !== createdBy) {
      throw new AppError({
        id: 'CommentService.update',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có bình luận này',
      });
    }

    const comment = await CommentRepository.update(commentId, data);

    return comment;
  };

  // Cập nhập bài viết hoặc reels
  static delete = async (payload: { commentId: string; createdBy: string }) => {
    const { createdBy, commentId } = payload;

    const olderComment = await CommentRepository.getById(commentId);

    if (!olderComment) {
      throw new AppError({
        id: 'CommentService.delete',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bình luận không tồn tại',
      });
    }

    if (String(olderComment.createdBy) !== createdBy) {
      throw new AppError({
        id: 'CommentService.delete',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không có bình luận này',
      });
    }

    const comment = await CommentRepository.delete(commentId, createdBy);

    return comment;
  };
}
