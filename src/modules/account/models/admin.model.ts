import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: mongoose.Schema.Types.ObjectId;
  buildIn: boolean;
}

const UserAdminSchema = new Schema<IUserAdmin>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    buildIn: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AdminModel = mongoose.model<IUserAdmin>('UserAdmin', UserAdminSchema);
