// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository';

export interface CreateGroupDTO {
  members: string[];
  isGroup: boolean;
}

export interface UpdateMemberGroupDTO {
  members: string[];
}

export interface GroupMessageFilters extends BaseFilters {
  keyword?: string;
  userId?: string;
}
