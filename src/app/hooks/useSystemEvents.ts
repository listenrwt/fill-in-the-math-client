import { useState } from 'react';

import { AuthResponse, LoginCredentials, RegistrationData, UserData } from '../../lib/system.types';

/**
 * Custom hook for handling system events via API
 * Currently focused on authentication functions
 */
export function useSystemEvents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API base URL (should be in env vars in production)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * Login a user with email and password
   */
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return { success: false, message: data.message || 'Login failed' };
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   */
  const register = async (registrationData: RegistrationData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return { success: false, message: data.message || 'Registration failed' };
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch current user data from the server
   * @returns User data response object
   */
  const getUserData = async (): Promise<{ success: boolean; message: string; user?: UserData }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to retrieve user data');
        return { success: false, message: data.message || 'Failed to retrieve user data' };
      }

      // If successful, update local storage with fresh data
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching user data';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user by clearing the session
   */
  const logout = async (): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });

      const data = await response.json();

      // Clear local storage regardless of server response
      localStorage.removeItem('user');

      if (!response.ok) {
        setError(data.message || 'Logout failed');
        return { success: false, message: data.message || 'Logout failed' };
      }

      return { success: true, message: data.message || 'Logout successful' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during logout';
      setError(errorMessage);

      // Still clear local storage even if there's an error
      localStorage.removeItem('user');

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    getUserData,
    loading,
    error,
  };
}

export default useSystemEvents;
