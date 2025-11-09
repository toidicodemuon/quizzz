import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { isAuthenticated, getRole } from "../utils/auth";

const MainLayout = () => import("../layouts/MainLayout.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: () => {
      const role = getRole();
      if (role === "TEACHER") return "/teacher/dashboard";
      if (role === "STUDENT") return "/student/dashboard";
      if (role === "ADMIN") return "/admin/dashboard";
      return "/login";
    },
  },
  {
    path: "/",
    component: MainLayout,
    meta: { auth: true },
    children: [
      // dashboards
      {
        path: "teacher/dashboard",
        name: "teacher-dashboard",
        component: () => import("../views/teacher/Dashboard.vue"),
      },
      {
        path: "student/dashboard",
        name: "student-dashboard",
        component: () => import("../views/student/Dashboard.vue"),
      },
      {
        path: "admin/dashboard",
        name: "admin-dashboard",
        component: () => import("../views/admin/Dashboard.vue"),
      },

      // teacher
      {
        path: "teacher/quiz/create",
        name: "teacher-quiz-create",
        component: () => import("../views/teacher/QuizCreate.vue"),
      },
      {
        path: "teacher/room/create",
        name: "teacher-room-create",
        component: () => import("../views/teacher/RoomCreate.vue"),
      },
      {
        path: "teacher/question-bank",
        name: "teacher-question-bank",
        component: () => import("../views/teacher/QuestionBank.vue"),
      },

      // student
      {
        path: "student/rooms",
        name: "student-rooms",
        component: () => import("../views/student/Rooms.vue"),
      },
      {
        path: "student/exams",
        name: "student-exams",
        component: () => import("../views/student/Exams.vue"),
      },

      // admin
      {
        path: "admin/users",
        name: "admin-users",
        component: () => import("../views/admin/Users.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.auth && !isAuthenticated()) {
    return next({ name: "login" });
  }
  next();
});

export default router;
