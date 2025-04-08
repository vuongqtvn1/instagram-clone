// Data Transfer Object (DTO)

import { IPostMedia } from '../models/post.model';

export interface CreatePostDTO {
  media: Array<IPostMedia>;
  caption: string;
  isReel: boolean;
}

export interface UpdatePostDTO {
  media: Array<IPostMedia>;
  caption: string;
}
