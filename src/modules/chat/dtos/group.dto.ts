// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository';

export interface CreateGroupDTO {
  groupName: string;
  groupAvatar: string;
  members: string[];
  isGroup: boolean;
}

export interface UpdateMemberGroupDTO {
  groupName: string;
  groupAvatar: string;
  members: string[];
}

export interface GroupMessageFilters extends BaseFilters {
  keyword?: string;
  userId?: string;
}
