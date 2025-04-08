import { StatusCodes } from 'http-status-codes';
import { AppError } from '~/utils/app-error';
import { PostRepository } from '../repositories/post.repository';
import { CreateCommentDTO, ReplyCommentDTO, UpdateCommentDTO } from '../dtos/comment.dto';
import { CommentRepository } from '../repositories/comment.repository';

export class CommentService {
  static getListByPost = async (postId: string) => {
    const comments = await CommentRepository.getListByPost(postId);

    return comments;
  };
  // comment post
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

    await PostRepository.commentPost(data.postId, String(comment._id));

    // Gửi thông báo nếu người bình luận không phải chủ bài viết
    if (post.createdBy.toString() !== createdBy) {
      // const notification = new Notification({
      //   sender: userId,
      //   receiver: post.user,
      //   type: 'comment',
      //   postId,
      // });
      // await notification.save();
      // const receiverSocketId = onlineUsers.get(post.user.toString());
      // if (receiverSocketId) {
      //   io.to(receiverSocketId).emit('new_notification', {
      //     sender: userId,
      //     type: 'comment',
      //   });
      // }
    }

    return comment;
  };

  // reply comment
  static reply = async (createdBy: string, data: ReplyCommentDTO) => {
    const { content, commentId } = data;

    if (!content) {
      throw new AppError({
        id: 'CommentService.reply',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Nội dung không được để trống!',
        errors: {
          content: [
            { id: 'Nội dung không được để trống!', message: 'Nội dung không được để trống!' },
          ],
        },
      });
    }

    const parentComment = await CommentRepository.getById(commentId);

    if (!parentComment) {
      throw new AppError({
        id: 'CommentService.reply',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bình luận không tồn tại',
      });
    }

    const postId = String(parentComment.post);

    const replyComment = await CommentRepository.reply({
      createdBy,
      content,
      postId,
      parentCommentId: commentId,
    });

    await PostRepository.commentPost(postId, String(replyComment._id));

    return replyComment;
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

    await PostRepository.removeCommentPost(String(olderComment.post), commentId);

    return comment;
  };
}
