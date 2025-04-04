import mongoose, { Schema, Document } from 'mongoose';

export enum EAuthProvider {
  Account = 'account',
  Google = 'google',
  Discord = 'discord',
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  providerId: string;
  provider: EAuthProvider;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      validate: {
        validator(this, value) {
          return this.provider !== EAuthProvider.Account || !!value;
        },
        message: 'Password is required',
      },
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator(this, value) {
          return this.provider === EAuthProvider.Account || !!value;
        },
        message: 'providerId is required',
      },
    },
    provider: {
      type: String,
      enum: Object.values(EAuthProvider),
      required: true,
      default: EAuthProvider.Account,
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
