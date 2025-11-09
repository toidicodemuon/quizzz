# Frontend (Vue 3 + Bootstrap 5)

Form đăng nhập đơn giản gọi API `POST /api/auth/login`.

## Cài đặt & chạy

1. Cài dependencies
   ```bash
   cd frontend
   npm install
   ```
2. Chạy dev server
   ```bash
   npm run dev
   ```
   Mặc định chạy ở `http://localhost:5173` (đã được bật CORS ở backend).

## Cấu hình API

- Tạo file `.env` dựa trên `.env.example` nếu cần đổi URL:
  ```env
  VITE_API_BASE_URL=http://localhost:3000
  ```

## Hành vi

- Gửi `email` và `password` tới `${VITE_API_BASE_URL}/api/auth/login`.
- Lưu `accessToken`, `refreshToken`, và `user` vào `localStorage` khi đăng nhập thành công.
- Hiển thị lỗi từ server nếu đăng nhập thất bại.

