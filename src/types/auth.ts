export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  subdomain?: string;
  subdomainId?: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}
