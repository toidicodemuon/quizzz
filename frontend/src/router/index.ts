import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },

  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/pages/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/modules/auth/pages/Register.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/modules/auth/pages/ForgotPassword.vue'),
    meta: { guestOnly: true },
  },

  // Admin
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, roles: ['ADMIN'] },
    children: [
      { path: '', redirect: { name: 'admin-users' } },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/modules/admin/pages/Users.vue'),
      },
      {
        path: 'quizzes',
        name: 'admin-quizzes',
        component: () => import('@/modules/admin/pages/Quizzes.vue'),
      },
    ],
  },

  // Teacher
  {
    path: '/teacher',
    component: () => import('@/layouts/TeacherLayout.vue'),
    meta: { requiresAuth: true, roles: ['TEACHER'] },
    children: [
      {
        path: 'dashboard',
        name: 'teacher-dashboard',
        component: () => import('@/modules/teacher/pages/Dashboard.vue'),
      },
      {
        path: 'quizzes',
        name: 'teacher-quizzes',
        component: () => import('@/modules/teacher/pages/Quizzes.vue'),
      },
      {
        path: 'submissions',
        name: 'teacher-submissions',
        component: () => import('@/modules/teacher/pages/Submissions.vue'),
      },
    ],
  },

  // Student
  {
    path: '/student',
    component: () => import('@/layouts/StudentLayout.vue'),
    meta: { requiresAuth: true, roles: ['STUDENT'] },
    children: [
      {
        path: 'dashboard',
        name: 'student-dashboard',
        component: () => import('@/modules/student/pages/Dashboard.vue'),
      },
      {
        path: 'quizzes/:id',
        name: 'student-take-quiz',
        component: () => import('@/modules/student/pages/TakeQuiz.vue'),
        props: true,
      },
      {
        path: 'results/:id',
        name: 'student-results',
        component: () => import('@/modules/student/pages/Results.vue'),
        props: true,
      },
    ],
  },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div class="p-6">Not Found</div>' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

