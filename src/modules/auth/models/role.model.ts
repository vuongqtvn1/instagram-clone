import mongoose, { Schema, Document } from 'mongoose';
import { EPermissions } from './permission.model';

export interface IRole extends Document {
  name: string;
  permissions: EPermissions[];
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    permissions: {
      type: [{ type: String, enum: Object.values(EPermissions), required: true }],
      required: true,
    },
  },
  { timestamps: true },
);

export const RoleModel = mongoose.model<IRole>('Role', RoleSchema);
