import * as yup from 'yup';

export const sendMessageSchema = yup.object({
  groupId: yup.string().required('FIELD_REQUIRED'),
  text: yup.string(),
  images: yup.array(yup.string()).default([]),
  videos: yup.array(yup.string()).default([]),
  replyId: yup.string(),
});

export const updateMessageSchema = yup.object({
  text: yup.string(),
  images: yup.array(yup.string()).default([]),
  videos: yup.array(yup.string()).default([]),
});
