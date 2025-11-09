import axios from "axios";
import { getToken, getRefreshToken, saveAuth, logout } from "./utils/auth";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000") + "/api";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` } as any;
  return config;
});

// 401 handler: try refresh then retry, else logout
let refreshPromise: Promise<any> | null = null;
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    const status = response?.status;
    const url: string = config?.url || "";
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/refresh");
    if (status === 401 && !isAuthRoute && !config.__isRetryRequest) {
      const rt = getRefreshToken();
      if (!rt) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        logout();
        window.location.hash = "#/login";
        return Promise.reject(error);
      }
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(baseURL + "/auth/refresh", { refreshToken: rt })
            .then((res) => {
              const data = res.data || {};
              saveAuth({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user });
              refreshPromise = null;
              return data;
            })
            .catch((e) => {
              refreshPromise = null;
              throw e;
            });
        }
        const data = await refreshPromise;
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${data.accessToken}` } as any;
        config.__isRetryRequest = true;
        return api.request(config);
      } catch (e) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        logout();
        window.location.hash = "#/login";
      }
    }
    return Promise.reject(error);
  }
);

export type Paginated<T> = { items: T[]; total: number };

export default api;
