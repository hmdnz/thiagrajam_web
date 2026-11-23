import { create } from 'zustand';
import { UserProfileOut, UserRole } from '../types/auth';
import {
  getStoredToken,
  setStoredToken,
  clearStoredAuth,
  setOnUnauthorizedCallback,
} from '../api/client';
import { usersApi } from '../api/users';

const USER_STORAGE_KEY = 'wenyfour_user';
const ROLE_STORAGE_KEY = 'wenyfour_active_role';

interface AuthState {
  user: UserProfileOut | null;
  token: string | null;
  activeRole: 'passenger' | 'driver';
  isLoading: boolean;
  isAuthenticated: boolean;
  initAuth: () => Promise<void>;
  setAuth: (token: string, user: UserProfileOut, defaultRole?: UserRole) => Promise<void>;
  updateUser: (user: Partial<UserProfileOut>) => void;
  switchRole: (role: 'passenger' | 'driver') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Bind 401 callback
  setOnUnauthorizedCallback(() => {
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  });

  return {
    user: null,
    token: null,
    activeRole: 'passenger',
    isLoading: true,
    isAuthenticated: false,

    initAuth: async () => {
      try {
        const token = getStoredToken();
        const savedUserStr = localStorage.getItem(USER_STORAGE_KEY);
        const savedRole = (localStorage.getItem(ROLE_STORAGE_KEY) as 'passenger' | 'driver') || 'passenger';

        let savedUser: UserProfileOut | null = null;
        if (savedUserStr) {
          try {
            savedUser = JSON.parse(savedUserStr);
          } catch {
            savedUser = null;
          }
        }

        if (token) {
          const role =
            savedRole || (savedUser?.role === 'driver' || savedUser?.is_driver ? 'driver' : 'passenger');

          set({
            token,
            user: savedUser,
            isAuthenticated: true,
            activeRole: role,
            isLoading: false,
          });

          // Fetch fresh profile in the background
          try {
            const freshUser = await usersApi.getMyProfile();
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
            set({ user: freshUser });
          } catch {
            // Keep existing cached profile
          }
        } else {
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      } catch {
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    },

    setAuth: async (token: string, user: UserProfileOut, defaultRole?: UserRole) => {
      setStoredToken(token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      const activeRole = defaultRole === 'driver' || user.is_driver ? 'driver' : 'passenger';
      localStorage.setItem(ROLE_STORAGE_KEY, activeRole);

      set({
        token,
        user,
        activeRole,
        isAuthenticated: true,
        isLoading: false,
      });
    },

    updateUser: (partialUser: Partial<UserProfileOut>) => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, ...partialUser };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
      set({ user: updated });
    },

    switchRole: (role: 'passenger' | 'driver') => {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      set({ activeRole: role });
    },

    logout: () => {
      clearStoredAuth();
      localStorage.removeItem(ROLE_STORAGE_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        activeRole: 'passenger',
      });
    },
  };
});
