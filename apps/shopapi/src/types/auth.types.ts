export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  adminSecret?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
