export type AppMenuItem = {
  label: string;
  to: string;
  icon?: string; // Bootstrap Icons class suffix, e.g., 'bi-speedometer2'
  newTab?: boolean;
  children?: AppMenuItem[];
};

export const MENU: Record<string, Array<AppMenuItem>> = {
  TEACHER: [
    {
      label: "Dashboard",
      to: "/teacher/dashboard",
      icon: "bi-speedometer2",
      newTab: true,
    },
    {
      label: "Quản lý bài thi",
      to: "/teacher/attempts",
      icon: "bi-clipboard-check",
      newTab: true,
    },
    {
      label: "Quản lý phòng thi",
      to: "/teacher/room/create",
      icon: "bi-door-open",
      newTab: true,
    },
    {
      label: "Quản lý đề thi",
      to: "/teacher/quiz/create",
      icon: "bi-journal-text",
      newTab: true,
    },
    {
      label: "Quản lý câu hỏi",
      to: "/teacher/question-bank",
      icon: "bi-question-circle",
      newTab: true,
    },
    {
      label: "Quản lý học viên",
      to: "/teacher/student",
      icon: "bi-people",
      newTab: true,
    },
    {
      label: "Quản lý môn học",
      to: "/teacher/subjects",
      icon: "bi-tags",
      newTab: true,
    },
  ],
  STUDENT: [
    {
      label: "Dashboard",
      to: "/student/dashboard",
      icon: "bi-speedometer",
      newTab: true,
    },
    {
      label: "Phòng thi",
      to: "/student/rooms",
      icon: "bi-door-open",
      newTab: true,
    },
    {
      label: "Bài thi",
      to: "/student/exams",
      icon: "bi-ui-checks-grid",
      newTab: true,
    },
  ],
  ADMIN: [
    {
      label: "Quản lý người dùng",
      to: "/admin/users",
      icon: "bi-people-fill",
      newTab: true,
    },
  ],
};

export function getMenuByRole(role?: string): AppMenuItem[] {
  const key = String(role || "").toUpperCase();
  return MENU[key] || [];
}
