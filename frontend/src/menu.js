export const MENU = {
  TEACHER: [
    { label: 'Dashboard', to: '/teacher/dashboard' },
    { label: 'Tạo đề thi', to: '/teacher/quiz/create' },
    { label: 'Tạo phòng thi', to: '/teacher/room/create' },
    { label: 'Ngân hàng câu hỏi', to: '/teacher/question-bank' },
  ],
  STUDENT: [
    { label: 'Dashboard', to: '/student/dashboard' },
    { label: 'Phòng thi', to: '/student/rooms' },
    { label: 'Bài thi', to: '/student/exams' },
  ],
  ADMIN: [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Quản lý người dùng', to: '/admin/users' },
  ],
};

export function getMenuByRole(role) {
  const key = String(role || '').toUpperCase();
  return MENU[key] || [];
}

