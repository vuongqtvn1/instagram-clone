import * as yup from 'yup';

export const removeFileSchema = yup.object({
  paths: yup
    .array(yup.string().required('FIELD_REQUIRED'))
    .min(1, 'FIELD_REQUIRED')
    .required('FIELD_REQUIRED'),
});
