export interface AuthUser {
  id: string | number;
  userName: string;
  email?: string;
  avatar?: string;
  roles?: string[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  expiresIn?: number;
}
