# Quiz Platform Frontend (Vue 3 + Vite + TS)

This is a ready-to-develop Vue 3 boilerplate for a Quiz Platform with three roles: Admin, Teacher, Student. It includes Tailwind CSS (+ DaisyUI), Pinia, Vue Router, Axios service layer, Vue I18n (English + Vietnamese), role-based routing and example pages/components.

## Tech Stack
- Vue 3 + Vite + TypeScript
- Tailwind CSS (+ DaisyUI)
- Pinia (state management)
- Vue Router (role-based guards)
- Vue I18n (en/vi)
- Axios (JWT interceptor)
- ESLint + Prettier

## Getting Started

- Prerequisites: Node.js 18+

- Install and run:

```bash
cd frontend
npm install
npm run dev
```

- Configure API base URL (optional):
  - Edit `frontend/.env` → `VITE_API_BASE_URL` (defaults to `http://localhost:3000`).

## Project Structure

```
src/
  assets/                 # Tailwind entry
  components/
    common/               # Language/Theme toggles
    ui/                   # UiButton/UiInput/UiModal/UiTable/UiPagination
  layouts/                # Admin/Teacher/Student layouts
  locales/                # en/vi translations
  modules/
    auth/                 # Auth pages + store
    admin/                # Admin pages (Users, Quizzes)
    teacher/              # Teacher pages (Dashboard, Quizzes, Submissions)
    student/              # Student pages (Dashboard, TakeQuiz, Results)
    quiz/                 # Quiz store (example)
  plugins/                # i18n setup
  router/                 # routes + guards
  services/               # axios instance + services
  types/                  # shared TS interfaces
```

## Role-based Routing
- `/admin/*` → AdminLayout (requires `ADMIN`)
- `/teacher/*` → TeacherLayout (requires `TEACHER`)
- `/student/*` → StudentLayout (requires `STUDENT`)
- Auth pages: `/login`, `/register`, `/forgot-password`

Guards are defined in `src/router/guards.ts` and rely on `auth` store.

## State
Pinia stores:
- `auth` store: token, user, role, theme, language
- `quiz` store: quiz listing (example)

## I18n
- Base languages: English (`src/locales/en.json`) and Vietnamese (`src/locales/vi.json`).
- Default locale via `VITE_DEFAULT_LOCALE`.

## Notes
- Service calls (Auth/Users/Quizzes) target `VITE_API_BASE_URL`. Until the backend is available, pages fall back to simple placeholders.
- Linting: `npm run lint`. Type-check: `npm run type-check`.

## License
This boilerplate is unlicensed within this repository; use as needed within your project context.
