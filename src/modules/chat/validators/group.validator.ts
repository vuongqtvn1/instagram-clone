import * as yup from 'yup';

export const createGroupSchema = yup.object({
  members: yup.array(yup.string()).min(1, 'FIELD_REQUIRED').required('FIELD_REQUIRED'),
  groupName: yup.string().required('FIELD_REQUIRED'),
  groupAvatar: yup.string(),
  isGroup: yup.boolean().required('FIELD_REQUIRED'),
});

export const updateGroupMemberSchema = yup.object({
  groupName: yup.string().required('FIELD_REQUIRED'),
  groupAvatar: yup.string(),
  members: yup.array(yup.string()).min(1, 'FIELD_REQUIRED').required('FIELD_REQUIRED'),
});
