import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { usersApi } from '../api/users';
import { useAuthStore } from '../store/authStore';
import {
  UserRegisterInput,
  VerifyOtpInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  ProfileUpdateInput,
} from '../types/auth';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
      const loginRes = await authApi.login(identifier, password);
      // Fetch full profile with the issued token
      const profile = await usersApi.getMyProfile();
      await setAuth(loginRes.access_token, profile, loginRes.active_role);
      return { loginRes, profile };
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (input: UserRegisterInput) => authApi.register(input),
  });
};

export const useVerifyOtp = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (input: VerifyOtpInput) => {
      const res = await authApi.verifyOtp(input);
      const profile = await usersApi.getMyProfile();
      await setAuth(res.access_token, profile);
      return { res, profile };
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: (input: ResendOtpInput) => authApi.resendOtp(input),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => authApi.forgotPassword(input),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => authApi.resetPassword(input),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (input: ProfileUpdateInput) => usersApi.updateMyProfile(input),
    onSuccess: (updatedProfile) => {
      updateUser(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] });
    },
  });
};
