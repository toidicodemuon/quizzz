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
        meta: { pageTitle: "DASHBOARD" },
      },
      {
        path: "student/dashboard",
        name: "student-dashboard",
        component: () => import("../views/student/Dashboard.vue"),
        meta: { pageTitle: "DASHBOARD" },
      },
      {
        path: "admin/dashboard",
        name: "admin-dashboard",
        component: () => import("../views/admin/Dashboard.vue"),
        meta: { pageTitle: "DASHBOARD" },
      },

      // teacher
      {
        path: "teacher/quiz/create",
        name: "teacher-quiz-create",
        component: () => import("../views/teacher/QuizCreate.vue"),
        meta: { pageTitle: "TẠO ĐỀ THI" },
      },
      {
        path: "teacher/room/create",
        name: "teacher-room-create",
        component: () => import("../views/teacher/RoomCreate.vue"),
        meta: { pageTitle: "TẠO PHÒNG THI" },
      },
      {
        path: "teacher/attempts",
        name: "teacher-attempts",
        component: () => import("../views/teacher/AttemptsManage.vue"),
        meta: { pageTitle: "QUẢN LÝ BÀI THI" },
      },
      {
        path: "teacher/question-bank",
        name: "teacher-question-bank",
        component: () => import("../views/teacher/QuestionBank.vue"),
        meta: { pageTitle: "NGÂN HÀNG CÂU HỎI" },
      },
      {
        path: "teacher/subjects",
        name: "teacher-subjects",
        component: () => import("../views/teacher/Subjects.vue"),
        meta: { pageTitle: "CHỦ ĐỀ" },
      },
      // student
      {
        path: "student/rooms",
        name: "student-rooms",
        component: () => import("../views/student/Rooms.vue"),
        meta: { pageTitle: "PHÒNG THI" },
      },
      {
        path: "student/exams",
        name: "student-exams",
        component: () => import("../views/student/Exams.vue"),
        meta: { pageTitle: "BÀI THI" },
      },

      // admin
      {
        path: "admin/users",
        name: "admin-users",
        component: () => import("../views/admin/Users.vue"),
        meta: { pageTitle: "QUẢN LÝ NGƯỜI DÙNG" },
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
