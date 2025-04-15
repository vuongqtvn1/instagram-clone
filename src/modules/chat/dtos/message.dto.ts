// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository';

export interface SendMessageDTO {
  groupId: string;
  text: string;
  images: string[];
  videos: string[];
  replyId: string;
}

export interface UpdateMessageDTO {
  text: string;
  images: string[];
  videos: string[];
}

export interface MessageFilters extends BaseFilters {
  groupId?: string;
}
