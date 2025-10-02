import type { Router } from 'vue-router';
import { useAuthStore } from '@/modules/auth/stores/auth';

function homeByRole(role?: string | null) {
  switch (role) {
    case 'ADMIN':
      return { path: '/admin' };
    case 'TEACHER':
      return { path: '/teacher/dashboard' };
    case 'STUDENT':
      return { path: '/student/dashboard' };
    default:
      return { name: 'login' };
  }
}

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const auth = useAuthStore();
    const isAuthed = auth.isAuthenticated;
    const userRole = auth.user?.role ?? null;

    if (to.meta?.guestOnly && isAuthed) {
      return next(homeByRole(userRole));
    }

    if (to.meta?.requiresAuth && !isAuthed) {
      return next({ name: 'login' });
    }

    const roles = (to.meta?.roles as string[] | undefined) ?? undefined;
    if (roles && roles.length > 0) {
      if (!userRole || !roles.includes(userRole)) {
        return next({ name: 'login' });
      }
    }

    next();
  });
}

