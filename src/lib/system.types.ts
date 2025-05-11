export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  username: string;
  password: string;
}

export interface UserData {
  user_id: number;
  username: string;
  email: string;
  date_registered: string;
  profile_picture: number | null;
  user_type: string;
  experience: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserData;
}

export interface PasswordResetData {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface UsernameChangeData {
  newUsername: string;
}

export interface AvatarChangeData {
  newAvatarId: number;
}

export interface AccountResponse {
  success: boolean;
  message: string;
  user?: UserData;
}
