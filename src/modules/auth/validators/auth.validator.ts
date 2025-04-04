import * as yup from 'yup';

export const registerSchema = yup.object({
  name: yup.string().required('FIELD_REQUIRED'),
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

export const loginSchema = yup.object({
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
