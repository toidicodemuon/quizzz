// src/config/api.ts
// All frontend requests should go through '/API/*'.
// Vite dev server proxies '/API' -> VITE_API_BASE_URL with '/api' rewrite.

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/API/auth/login`,
    REGISTER: `/API/auth/register`,
    ME: `/API/auth/me`,
    LOGOUT: `/API/auth/logout`,
  },
  USERS: {
    LIST: `/API/users`,
    ROLE: (id: number) => `/API/users/${id}/role`,
    ACTIVE: (id: number) => `/API/users/${id}/active`,
  },
  QUIZZES: {
    LIST: `/API/quizzes`,
    ITEM: (id: number) => `/API/quizzes/${id}`,
    PUBLISH: (id: number) => `/API/quizzes/${id}/publish`,
  },
  SUBMISSIONS: {
    LIST: `/API/submissions`,
  },
};

export default API_ENDPOINTS;
