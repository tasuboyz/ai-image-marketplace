export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio: string;
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  avatar?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
