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
      // Log the full request details for debugging
      console.log(`Sending request to: ${API_BASE_URL}/api/auth/user with credentials included`);

      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log('User data response status:', response.status);
      const data = await response.json();
      console.log('User data response:', data);

      if (!response.ok) {
        setError(data.message || 'Failed to retrieve user data');

        // Even if the server request fails, try to get data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            console.log('Using cached user data from localStorage');
            return {
              success: true,
              message: 'Using cached user data',
              user: userData,
            };
          } catch (parseError) {
            console.error('Error parsing user data from localStorage:', parseError);
          }
        }

        return { success: false, message: data.message || 'Failed to retrieve user data' };
      }

      // If successful, update local storage with fresh data
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      console.error('Error in getUserData:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching user data';
      setError(errorMessage);

      // On error, try to get data from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Using cached user data from localStorage after fetch error');
          return {
            success: true,
            message: 'Using cached user data',
            user: userData,
          };
        } catch (parseError) {
          console.error('Error parsing user data from localStorage:', parseError);
        }
      }

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

  /**
   * Reset the user's password
   * @param passwordData Object containing email, current password and new password
   * @returns Response with success status and message
   */
  const resetPassword = async (passwordData: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<{
    success: boolean;
    message: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      // First get userId using findByEmail
      const userResult = await findByEmail(passwordData.email);

      if (!userResult.success || !userResult.user) {
        setError('Failed to find user with provided email');
        return { success: false, message: 'Failed to find user with provided email' };
      }

      const userId = userResult.user.user_id;

      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to reset password');
        return { success: false, message: data.message || 'Failed to reset password' };
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while resetting password';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change the user's username
   * @param usernameData Object containing the email and new username
   * @returns Response with success status, message, and updated user data
   */
  const changeUsername = async (usernameData: {
    email: string;
    newUsername: string;
  }): Promise<{
    success: boolean;
    message: string;
    user?: UserData;
  }> => {
    setLoading(true);
    setError(null);

    try {
      // First get userId using findByEmail
      const userResult = await findByEmail(usernameData.email);

      if (!userResult.success || !userResult.user) {
        setError('Failed to find user with provided email');
        return { success: false, message: 'Failed to find user with provided email' };
      }

      const userId = userResult.user.user_id;

      const response = await fetch(`${API_BASE_URL}/api/auth/change-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newUsername: usernameData.newUsername,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update username');
        return { success: false, message: data.message || 'Failed to update username' };
      }

      // Update local storage with updated user data
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while updating username';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change the user's avatar
   * @param avatarData Object containing the email and new avatar ID
   * @returns Response with success status, message, and updated user data
   */
  const changeAvatar = async (avatarData: {
    email: string;
    newAvatarId: number;
  }): Promise<{
    success: boolean;
    message: string;
    user?: UserData;
  }> => {
    setLoading(true);
    setError(null);

    try {
      // First get userId using findByEmail
      const userResult = await findByEmail(avatarData.email);

      if (!userResult.success || !userResult.user) {
        setError('Failed to find user with provided email');
        return { success: false, message: 'Failed to find user with provided email' };
      }

      const userId = userResult.user.user_id;

      const response = await fetch(`${API_BASE_URL}/api/auth/change-avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newAvatarId: avatarData.newAvatarId,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to update avatar');
        return { success: false, message: data.message || 'Failed to update avatar' };
      }

      // Update local storage with updated user data
      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while updating avatar';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete the user's account
   * @param email The email of the user account to delete
   * @returns Response with success status and message
   */
  const deleteAccount = async (
    email: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    setLoading(true);
    setError(null);

    try {
      // First get userId using findByEmail
      const userResult = await findByEmail(email);

      if (!userResult.success || !userResult.user) {
        setError('Failed to find user with provided email');
        return { success: false, message: 'Failed to find user with provided email' };
      }

      const userId = userResult.user.user_id;

      const response = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to delete account');
        return { success: false, message: data.message || 'Failed to delete account' };
      }

      // Clear local storage on successful account deletion
      localStorage.removeItem('user');

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while deleting account';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Find a user by their email address
   * @param email The email to search for
   * @returns Response with the user if found
   */
  const findByEmail = async (
    email: string
  ): Promise<{
    success: boolean;
    message: string;
    user?: UserData;
  }> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/find-by-email?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to find user');
        return { success: false, message: data.message || 'Failed to find user' };
      }

      return {
        success: true,
        message: 'User found',
        user: data.user,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while finding user';
      setError(errorMessage);
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
    resetPassword,
    changeUsername,
    changeAvatar,
    deleteAccount,
    loading,
    error,
  };
}

export default useSystemEvents;
