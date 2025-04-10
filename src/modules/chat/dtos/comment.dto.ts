// Data Transfer Object (DTO)

export interface CreateCommentDTO {
  content: string;
  postId: string;
}

export interface UpdateCommentDTO {
  content: string;
}
