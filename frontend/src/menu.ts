export const MENU: Record<string, Array<{ label: string; to: string }>> = {
  TEACHER: [
    { label: "Dashboard", to: "/teacher/dashboard" },
    { label: "Quản lý đề thi", to: "/teacher/quiz/create" },
    { label: "Quản lý phòng thi", to: "/teacher/room/create" },
    { label: "Quản lý câu hỏi", to: "/teacher/question-bank" },
    { label: "Quản lý học viên", to: "/teacher/student" },
    { label: "Quản lý chủ đề", to: "/teacher/subjects" },
  ],
  STUDENT: [
    { label: "Dashboard", to: "/student/dashboard" },
    { label: "Phòng thi", to: "/student/rooms" },
    { label: "Bài thi", to: "/student/exams" },
  ],
  ADMIN: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Quản lý người dùng", to: "/admin/users" },
  ],
};

export function getMenuByRole(role?: string) {
  const key = String(role || "").toUpperCase();
  return MENU[key] || [];
}
