import { StatusCodes } from 'http-status-codes';
import { sendNotifyToWS } from '~/config/ws';
import { UserService } from '~/modules/account/services/user.service';
import { NotificationType } from '~/modules/notification/models/notification.model';
import { NotificationService } from '~/modules/notification/services/notifaction.service';
import { AppError } from '~/utils/app-error';
import { BaseFilters } from '~/utils/repository';
import { CreateCommentDTO, ReplyCommentDTO, UpdateCommentDTO } from '../dtos/comment.dto';
import { CommentRepository } from '../repositories/comment.repository';
import { PostRepository } from '../repositories/post.repository';

export class CommentService {
  static getListByPost = async (postId: string, filters: BaseFilters) => {
    const comments = await CommentRepository.getPagination({
      ...filters,
      posts: [postId],
    });

    return comments;
  };

  static getListByComment = async (postId: string, commentId: string, filters: BaseFilters) => {
    const comments = await CommentRepository.getPagination({
      ...filters,
      posts: [postId],
      parentComments: [commentId],
    });

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

    const comment = await CommentRepository.createPostComment(createdBy, data);

    await PostRepository.commentPost(data.postId, String(comment._id));

    // Gửi thông báo nếu người bình luận không phải chủ bài viết
    if (post.createdBy.toString() !== createdBy) {
      const notification = await NotificationService.create({
        sender: createdBy,
        receiver: [String(post.createdBy)],
        type: NotificationType.COMMENT,
        targetId: postId,
      });

      sendNotifyToWS([String(post.createdBy)], notification);
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

    // xoá cái comment bị xoá ra khỏi mảng replies
    if (olderComment.parentCommentId) {
      const parentCommentId = String(olderComment.parentCommentId);
      await CommentRepository.removeReplies(parentCommentId, commentId);
    }

    // xoá cái comment ra khỏi mảng comments trong bài post
    await PostRepository.removeCommentPost(String(olderComment.post), commentId);

    return comment;
  };

  // like comment/ unlike comment
  static async likeComment(commentId: string, userLike: string) {
    const [comment, user] = await Promise.all([
      CommentRepository.getById(commentId),
      UserService.getById(userLike),
    ]);

    if (!comment) {
      throw new AppError({
        id: 'CommentService.likeComment',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bình luận không tồn tại',
      });
    }

    if (!user) {
      throw new AppError({
        id: 'CommentService.likeComment',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const likes = comment.likes.map((id) => String(id));

    // Kiểm tra xem đã follow chưa
    const alreadyLike = likes.includes(userLike);

    if (alreadyLike) {
      throw new AppError({
        id: 'CommentService.likeComment',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn đã thích bình luận này rồi!',
      });
    }

    await CommentRepository.likeComment(commentId, userLike);
  }

  static async unlikeComment(commentId: string, userUnlike: string) {
    const [comment, user] = await Promise.all([
      CommentRepository.getById(commentId),
      UserService.getById(userUnlike),
    ]);

    if (!comment) {
      throw new AppError({
        id: 'CommentService.unlikeComment',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Bình luận không tồn tại',
      });
    }

    if (!user) {
      throw new AppError({
        id: 'CommentService.unlikeComment',
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Người dùng không tồn tại!',
      });
    }

    const likes = comment.likes.map((id) => String(id));

    // Kiểm tra xem đã follow chưa
    const alreadyLike = likes.includes(userUnlike);

    if (!alreadyLike) {
      throw new AppError({
        id: 'CommentService.unlikeComment',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn chưa thích bình luận này!',
      });
    }

    await CommentRepository.unlikeComment(commentId, userUnlike);
  }
}
