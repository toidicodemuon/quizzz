import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<AuthUser>({} as AuthUser);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: AuthUser, accessToken?: string) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    if (accessToken) {
      JwtService.saveToken(accessToken);
    }
    ApiService.setHeader();
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as AuthUser;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: LoginPayload) {
    // API expects /auth/login with { username, password }
    return ApiService.post("auth/login", credentials)
      .then(({ data }) => {
        // data: { accessToken, refreshToken, user }
        setAuth(data.user as AuthUser, data.accessToken as string);
      })
      .catch(({ response }) => {
        setError(response?.data?.errors ?? { auth: response?.data?.message || "Login failed" });
      });
  }

  function logout() {
    purgeAuth();
  }

  // Not implemented against /api backend
  function register(_credentials: unknown) {}

  function forgotPassword(_email: string) {}

  function verifyAuth() {
    const token = JwtService.getToken();
    if (!token) {
      purgeAuth();
      return;
    }
    // set header for subsequent requests
    ApiService.setHeader();
    // If user already has role/id, keep it. Otherwise decode from token payload.
    if (!user.value?.id || !user.value?.role) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        user.value = {
          id: Number(decoded.sub),
          username: String(decoded.username || ""),
          fullName: user.value?.fullName || "",
          email: user.value?.email || "",
          role: String(decoded.role || "").toUpperCase(),
          avatarUrl: user.value?.avatarUrl ?? null,
        } as AuthUser;
        isAuthenticated.value = true;
      } catch (e) {
        // invalid token -> purge
        purgeAuth();
      }
    } else {
      isAuthenticated.value = true;
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
