import * as yup from 'yup';
import { EPermissions } from '../models/permission.model';

export const roleSchema = yup.object({
  name: yup.string().required('FIELD_REQUIRED'),
  permissions: yup
    .array(yup.mixed<EPermissions>().oneOf(Object.values(EPermissions)).required('FIELD_REQUIRED'))
    .min(1, 'FIELD_REQUIRED')
    .required('FIELD_REQUIRED'),
});
