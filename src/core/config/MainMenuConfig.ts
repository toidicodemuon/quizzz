export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
  roles?: Array<string>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    heading: "Teacher",
    route: "/teacher",
    pages: [
      {
        heading: "Dashboard",
        route: "/teacher/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-speedometer2",
        roles: ["TEACHER"],
      },
      {
        heading: "Tạo đề thi",
        route: "/teacher/quiz/create",
        keenthemesIcon: "element-10",
        bootstrapIcon: "bi-file-earmark-plus",
        roles: ["TEACHER"],
      },
      {
        heading: "Tạo phòng thi",
        route: "/teacher/room/create",
        keenthemesIcon: "element-9",
        bootstrapIcon: "bi-door-open",
        roles: ["TEACHER"],
      },
      {
        heading: "Ngân hàng câu hỏi",
        route: "/teacher/question-bank",
        keenthemesIcon: "element-plus",
        bootstrapIcon: "bi-collection",
        roles: ["TEACHER"],
      },
    ],
    roles: ["TEACHER"],
  },
  {
    heading: "Student",
    route: "/student",
    pages: [
      {
        heading: "Dashboard",
        route: "/student/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-speedometer2",
        roles: ["STUDENT"],
      },
      {
        heading: "Phòng thi",
        route: "/student/rooms",
        keenthemesIcon: "calendar-8",
        bootstrapIcon: "bi-grid-1x2",
        roles: ["STUDENT"],
      },
      {
        heading: "Bài thi",
        route: "/student/exams",
        keenthemesIcon: "chart",
        bootstrapIcon: "bi-journal-text",
        roles: ["STUDENT"],
      },
    ],
    roles: ["STUDENT"],
  },
  {
    heading: "Admin",
    route: "/admin",
    pages: [
      {
        heading: "Dashboard",
        route: "/admin/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-speedometer2",
        roles: ["ADMIN"],
      },
      {
        heading: "Quản lý người dùng",
        route: "/admin/users",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-people",
        roles: ["ADMIN"],
      },
    ],
    roles: ["ADMIN"],
  },
];

export default MainMenuConfig;
