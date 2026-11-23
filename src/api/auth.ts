import { apiClient } from './client';
import {
  LoginResponse,
  UserRegisterInput,
  UserRegisterResponse,
  VerifyOtpInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '../types/auth';

export const authApi = {
  // POST /auth/login (OAuth2 form-urlencoded: username, password)
  login: async (identifier: string, password: string): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append('username', identifier.trim());
    params.append('password', password);

    const response = await apiClient.post<LoginResponse>('/auth/login', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // POST /users
  register: async (input: UserRegisterInput): Promise<UserRegisterResponse> => {
    const response = await apiClient.post<UserRegisterResponse>('/users', input);
    return response.data;
  },

  // POST /verify-otp
  verifyOtp: async (input: VerifyOtpInput): Promise<{ message: string; access_token: string }> => {
    const response = await apiClient.post<{ message: string; access_token: string }>('/verify-otp', input);
    return response.data;
  },

  // POST /resend-otp
  resendOtp: async (input: ResendOtpInput): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/resend-otp', input);
    return response.data;
  },

  // POST /forgot-password
  forgotPassword: async (input: ForgotPasswordInput): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/forgot-password', input);
    return response.data;
  },

  // POST /reset-password
  resetPassword: async (input: ResetPasswordInput): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/reset-password', input);
    return response.data;
  },

  // POST /change-password
  changePassword: async (input: ChangePasswordInput): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/change-password', input);
    return response.data;
  },
};
