import { StatusCodes } from 'http-status-codes';
import { isArray, isBoolean, uniq } from 'lodash';
import { UserService } from '~/modules/account/services/user.service';
import { AppError } from '~/utils/app-error';
import { CreateGroupDTO, GroupMessageFilters, UpdateMemberGroupDTO } from '../dtos/group.dto';
import { GroupRepository } from '../repositories/group.repository';

export class GroupService {
  // get by group id
  static getByGroupId = async (groupId: string) => {
    const result = await GroupRepository.getByGroupId(groupId);

    return result;
  };

  // get list group chat
  static getListGroup = async (filters: GroupMessageFilters) => {
    const result = await GroupRepository.getPagination(filters);

    return result;
  };

  // create group message
  static create = async (createdBy: string, data: CreateGroupDTO) => {
    const { members, isGroup } = data;

    if (!isArray(members) || !members.length || !isBoolean(isGroup)) {
      throw new AppError({
        id: 'GroupService.create',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    const memberIds = uniq([...members, createdBy]);

    if (!isGroup) {
      if (memberIds.length !== 2) {
        throw new AppError({
          id: 'GroupService.create',
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Dữ liệu không hợp lệ!',
        });
      }

      const existingGroup = await GroupRepository.checkExistedPrivate(memberIds);

      if (existingGroup) {
        throw new AppError({
          id: 'GroupService.create',
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Nhóm chat đã tồn tại',
        });
      }
    }

    const group = await GroupRepository.createGroup(createdBy, {
      isGroup,
      members: memberIds,
    });

    return group;
  };

  static validateMembers = async (members: string[]) => {
    if (!isArray(members) || !members.length) {
      throw new AppError({
        id: 'GroupService.validateMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Dữ liệu không hợp lệ!',
      });
    }

    const checkExistMember = async (memberId: string) => {
      const member = await UserService.getById(memberId);

      if (!member) {
        throw new AppError({
          id: 'GroupService.validateMembers',
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Người dùng này không tồn tại',
        });
      }
    };

    const promises = members.map(checkExistMember);

    await Promise.all(promises);
  };

  // add member to group message
  static addMembers = async (userId: string, groupId: string, data: UpdateMemberGroupDTO) => {
    const { members } = data;

    await this.validateMembers(members);

    const olderGroup = await GroupRepository.getByGroupId(groupId);

    if (!olderGroup) {
      throw new AppError({
        id: 'GroupService.addMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Nhóm chat không tồn tại!',
      });
    }

    if (!olderGroup.isGroup) {
      throw new AppError({
        id: 'GroupService.addMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Đây không phải nhóm chat',
      });
    }

    const memberGroups = olderGroup.members.map((id) => String(id));

    if (!memberGroups.includes(userId)) {
      throw new AppError({
        id: 'GroupService.addMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Bạn không phải thành viên của nhóm này',
      });
    }

    const memberIds = uniq([...memberGroups, ...members]);

    const group = await GroupRepository.updateMembersGroup(groupId, memberIds);

    return group;
  };

  // add member to group message
  static removeMembers = async (userId: string, groupId: string, data: UpdateMemberGroupDTO) => {
    const { members } = data;

    await this.validateMembers(members);

    const olderGroup = await GroupRepository.getByGroupId(groupId);

    if (!olderGroup) {
      throw new AppError({
        id: 'GroupService.removeMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Nhóm chat không tồn tại!',
      });
    }

    if (!olderGroup.isGroup) {
      throw new AppError({
        id: 'GroupService.removeMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Đây không phải nhóm chat',
      });
    }

    if (olderGroup.createdBy.toString() !== userId) {
      throw new AppError({
        id: 'GroupService.removeMembers',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có quyền xoá người ra khỏi nhóm',
      });
    }

    const memberGroups = olderGroup.members.map((id) => String(id));

    const memberIds = uniq(memberGroups.filter((memberId) => !members.includes(memberId)));

    if (!memberIds.length || (memberIds.length === 1 && memberIds[0] === userId)) {
      const group = await GroupRepository.deleteGroup(groupId, userId);
      return group;
    }

    const group = await GroupRepository.updateMembersGroup(groupId, memberIds);
    return group;
  };

  // remove group message
  static removeGroup = async (userId: string, groupId: string) => {
    const olderGroup = await GroupRepository.getByGroupId(groupId);

    if (!olderGroup) {
      throw new AppError({
        id: 'GroupService.removeGroup',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Nhóm chat không tồn tại!',
      });
    }

    if (!olderGroup.isGroup) {
      throw new AppError({
        id: 'GroupService.removeGroup',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Đây không phải nhóm chat',
      });
    }

    if (olderGroup.createdBy.toString() !== userId) {
      throw new AppError({
        id: 'GroupService.removeGroup',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Không có quyền xoá nhóm chat',
      });
    }

    const group = await GroupRepository.deleteGroup(groupId, userId);
    return group;
  };
}
