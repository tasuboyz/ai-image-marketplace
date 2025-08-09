export interface User {
  _id?: string;
  username: string;
  avatar?: string;
  authMethod: 'keychain' | 'traditional';
  steemProfile?: {
    reputation?: number;
    sp?: number;
    followers?: number;
    following?: number;
    postCount?: number;
    about?: string;
  };
  bio?: string;
  isActive?: boolean;
  role?: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  updatedAt?: string;
}

export interface SteemAuthCredentials {
  username: string;
  signature: string;
  message: string;
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
