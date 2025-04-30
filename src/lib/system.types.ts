export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    user_id: number;
    username: string;
    email: string;
    date_registered: string;
    profile_picture: number | null;
    user_type: string;
    experience: number;
  };
}
