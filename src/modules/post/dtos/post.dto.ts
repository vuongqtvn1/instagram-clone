// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository';
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

export interface PostFilters extends BaseFilters {
  createdBy?: string[];
  isReel?: boolean;
  savedBy?: string[];
  excludes?: string[];
}
