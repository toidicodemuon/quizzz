import { defineStore } from 'pinia';
import type { User, LoginPayload, Role } from '@/types';
import * as AuthService from '@/services/auth';
import JwtService from '@/services/JwtService';

interface AuthState {
  token: string | null;
  user: User | null;
  language: 'en' | 'vi';
  theme: 'light' | 'dark';
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: JwtService.getToken(),
    user: (() => {
      try {
        const raw = localStorage.getItem('user');
        return raw ? (JSON.parse(raw) as User) : null;
      } catch {
        return null;
      }
    })(),
    language: (localStorage.getItem('language') as 'en' | 'vi') ||
      ((import.meta.env.VITE_DEFAULT_LOCALE as 'en' | 'vi') || 'en'),
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
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
      JwtService.saveToken(token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    async loadProfile() {
      // If backend supports /auth/me, use it; otherwise rely on persisted user
      if (!this.token) return;
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          this.user = JSON.parse(raw) as User;
        } catch {
          this.user = null;
        }
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      JwtService.destroyToken();
      localStorage.removeItem('user');
    },
    setLanguage(lang: 'en' | 'vi') {
      this.language = lang;
      localStorage.setItem('language', lang);
    },
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
      localStorage.setItem('theme', theme);
      const html = document.querySelector('html');
      if (html) html.setAttribute('data-theme', theme);
    },
  },
});
