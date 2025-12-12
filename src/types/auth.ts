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
