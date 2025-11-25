import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { isAuthenticated, getRole } from "../utils/auth";
import { getMenuByRole } from "../menu";

const MainLayout = () => import("../layouts/MainLayout.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: () => {
      const role = getRole();
      if (role === "TEACHER") return "/teacher/dashboard";
      if (role === "STUDENT") return "/student/dashboard";
      if (role === "ADMIN") return "/admin/users";
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
        path: "teacher/student",
        name: "teacher-student",
        component: () => import("../views/teacher/Students.vue"),
        meta: { pageTitle: "QUẢN LÝ HỌC VIÊN" },
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
        path: "student/rooms/:roomId",
        name: "student-room-exam",
        component: () => import("../views/student/RoomExam.vue"),
        meta: { pageTitle: "LÀM BÀI THI" },
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
      // common
      {
        path: "profile",
        name: "profile",
        component: () => import("../views/Profile.vue"),
        meta: { pageTitle: "THÔNG TIN CÁ NHÂN" },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/mini-web-cloud",
    name: "mini-web-cloud",
    component: () => import("../views/MiniWebCloudLanding.vue"),
    meta: { pageTitle: "Mini Web Cloud" },
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

// Update document title based on route meta or menu label
router.afterEach((to) => {
  const appName = (import.meta as any).env?.VITE_APP_NAME || "THAT";
  // Prefer menu label to ensure consistency with sidebar text
  const role = getRole();
  const items = getMenuByRole(role);
  const flatten = (arr: any[]): any[] =>
    arr.flatMap((it: any) => [
      it,
      ...(Array.isArray(it.children) ? flatten(it.children) : []),
    ]);
  const all = flatten(items);
  const normalize = (p: string) => "/" + String(p || "").replace(/^\/+/, "");
  const found = all.find(
    (it: any) =>
      typeof it.to === "string" && normalize(to.path) === normalize(it.to)
  );
  const menuLabel = found?.label as string | undefined;
  const metaTitle =
    typeof to.meta?.pageTitle === "string"
      ? (to.meta.pageTitle as string)
      : undefined;
  const title = menuLabel || metaTitle;
  document.title = title ? `${title} - ${appName}` : appName;
});

export default router;
