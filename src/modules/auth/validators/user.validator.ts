import * as yup from 'yup';
import { EUserGender } from '../models/user.model';

export const registerUserSchema = yup.object({
  name: yup.string().trim().required('FIELD_REQUIRED'),
  username: yup.string().lowercase().trim().required('FIELD_REQUIRED'),
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
  gender: yup.mixed<EUserGender>().oneOf(Object.values(EUserGender)).required('FIELD_REQUIRED'),
  phoneNumber: yup.string().trim().default(''),
  avatar: yup.string().trim().default(''),
  website: yup.string().trim().default(''),
  bio: yup.string().trim().default(''),
});

export const loginUserSchema = yup.object({
  username: yup.string().trim().lowercase().required('FIELD_REQUIRED'),
  password: yup.string().required('FIELD_REQUIRED'),
});
