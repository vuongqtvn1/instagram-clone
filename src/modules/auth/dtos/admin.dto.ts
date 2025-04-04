// Data Transfer Object (DTO)

export interface CreateAdminDTO {
  name: string;
  role: string;
  email: string;
}

export interface LoginAdminDTO {
  email: string;
  password: string;
}
