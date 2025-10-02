import { defineStore } from 'pinia';
import type { User, LoginPayload, Role } from '@/types';
import * as AuthService from '@/services/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  language: 'en' | 'vi';
  theme: 'light' | 'dark';
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: null,
    language: (import.meta.env.VITE_DEFAULT_LOCALE as 'en' | 'vi') || 'en',
    theme: 'light',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    role: (state): Role | null => state.user?.role ?? null,
  },
  actions: {
    async login(payload: LoginPayload) {
      const { token, user } = await AuthService.login(payload);
      this.token = token;
      this.user = user;
      localStorage.setItem('token', token);
    },
    async loadProfile() {
      if (!this.token) return;
      try {
        this.user = await AuthService.fetchProfile();
      } catch (e) {
        // token may be invalid
        this.logout();
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    setLanguage(lang: 'en' | 'vi') {
      this.language = lang;
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
      const html = document.querySelector('html');
      if (html) html.setAttribute('data-theme', theme);
    },
  },
});

