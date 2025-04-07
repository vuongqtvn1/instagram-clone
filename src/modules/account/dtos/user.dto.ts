// Data Transfer Object (DTO)

import { EUserGender } from '../models/user.model';

export interface RegisterDTO {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: EUserGender;
  password: string;
  avatar: string;
  website: string;
  bio: string;
}

export interface LoginDTO {
  username: string; // username / email
  password: string;
}
