import * as yup from 'yup';
import { EPostMediaType } from '../models/post.model';

export const createPostSchema = yup.object({
  media: yup
    .array(
      yup.object({
        type: yup
          .mixed<EPostMediaType>()
          .oneOf(Object.values(EPostMediaType))
          .required('FIELD_REQUIRED'),
        path: yup.string().required(),
      }),
    )
    .min(1, 'FIELD_REQUIRED')
    .required('FIELD_REQUIRED'),
  caption: yup.string().trim(),
  isReel: yup.boolean().default(false),
});

export const updatePostSchema = yup.object({
  media: yup
    .array(
      yup.object({
        type: yup
          .mixed<EPostMediaType>()
          .oneOf(Object.values(EPostMediaType))
          .required('FIELD_REQUIRED'),
        path: yup.string().required(),
      }),
    )
    .min(1, 'FIELD_REQUIRED')
    .required('FIELD_REQUIRED'),
  caption: yup.string().trim(),
});
