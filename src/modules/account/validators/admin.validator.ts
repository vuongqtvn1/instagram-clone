import * as yup from 'yup';

export const createAdminSchema = yup.object({
  name: yup.string().required('FIELD_REQUIRED'),
  role: yup.string().required('FIELD_REQUIRED'),
  password: yup.string(),
  email: yup
    .string()
    .email('FIELD_FORMAT')
    .trim()
    .lowercase()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: 'FIELD_FORMAT' },
    )
    .required('FIELD_REQUIRED'),
});

export const loginAdminSchema = yup.object({
  email: yup
    .string()
    .email('FIELD_FORMAT')
    .trim()
    .lowercase()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: 'FIELD_FORMAT' },
    )
    .required('FIELD_REQUIRED'),
  password: yup.string().required('FIELD_REQUIRED'),
});
