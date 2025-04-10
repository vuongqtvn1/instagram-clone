// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository';

export interface CreateCommentDTO {
  content: string;
  postId: string;
}

export interface ReplyCommentDTO {
  content: string;
  commentId: string;
}

export interface UpdateCommentDTO {
  content: string;
}

export interface CommentFilters extends BaseFilters {
  createdBy?: string[];
  posts?: string[];
  parentComments?: string[];
}
