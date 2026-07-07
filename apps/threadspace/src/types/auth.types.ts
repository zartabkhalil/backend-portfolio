import { Role } from "@prisma/client";

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  adminSecret?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyInput {
  email: string;
  otp: string;
}

export interface CreateUserRepositoryInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  role: Role;
}
