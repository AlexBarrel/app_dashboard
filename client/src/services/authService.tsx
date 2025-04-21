import axios from 'axios';

// Типы для логина
export interface LoginCredentials {
  email: string;
  password: string;
}

// Типы для регистрации
export interface RegisterData {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

// Ответ от сервера (можно расширить по необходимости)
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Логин пользователя
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
  return response.data;
};

// Регистрация пользователя
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, userData);
  return response.data;
};

// Отправка email для сброса пароля
export const sendResetEmail = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, { email });
    return response.data;
  } catch (error: any) {
    console.error('Error sending reset email:', error?.response?.data || error?.message || error);
    throw new Error(error?.response?.data?.message || 'Failed to send reset email');
  }
};

// Сброс пароля с использованием токена
export const resetPasswordWithToken = async (token: string, newPassword: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, {
      password: newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error during password reset:', error?.response?.data || error?.message || error);
    throw new Error(error?.response?.data?.message || 'Failed to reset password');
  }
};
