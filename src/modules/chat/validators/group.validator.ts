import * as yup from 'yup';

export const createGroupSchema = yup.object({
  members: yup.array(yup.string()).min(1, 'FIELD_REQUIRED').required('FIELD_REQUIRED'),
  isGroup: yup.boolean(),
});

export const updateGroupMemberSchema = yup.object({
  members: yup.array(yup.string()).min(1, 'FIELD_REQUIRED').required('FIELD_REQUIRED'),
});
