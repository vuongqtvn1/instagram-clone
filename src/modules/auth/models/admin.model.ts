import mongoose, { Schema, Document } from 'mongoose';

export enum EAdminLevel {
  SuperAdmin = 0,
  SystemAdmin = 1,
}

export interface IUserAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: mongoose.Schema.Types.ObjectId;
  level: EAdminLevel;
}

const UserAdminSchema = new Schema<IUserAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: 'Asdfgh112@' },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    level: { type: Number, enum: Object.values(EAdminLevel), required: true },
  },
  { timestamps: true },
);

export const AdminModel = mongoose.model<IUserAdmin>('UserAdmin', UserAdminSchema);
