# Foxtek Blog Frontend (Next.js)

Dự án Frontend cho nền tảng Foxtek Blog, được xây dựng bằng **Next.js (App Router)** kết hợp với **Tailwind CSS**. Dự án cung cấp giao diện người dùng hiện đại, tốc độ cao và thân thiện, kết nối trực tiếp với backend NestJS.

## 🚀 Công nghệ sử dụng

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **State Management & Data Fetching:** React Query (@tanstack/react-query)
- **Icons:** Lucide React
- **Package Manager:** `pnpm`

## ✨ Tính năng nổi bật

- **Kiến trúc linh hoạt:** Sử dụng Next.js App Router, chia tách Server Components và Client Components để tối ưu SEO và hiệu suất.
- **Tìm kiếm & Lọc:** Tìm kiếm bài viết theo từ khóa và lọc theo danh mục ngay trên thanh điều hướng hoặc sidebar.
- **Xác thực người dùng:** Đăng nhập, đăng ký tài khoản mới và luồng xác thực mã OTP.
- **Giao diện hiện đại (UI/UX):** 
  - Toast notifications được custom đẹp mắt và mượt mà.
  - Sidebar phong phú với các widget: Top Trending, Danh mục, Newsletter.
  - Loading skeletons và Transition state mượt mà.
- **Trang Quản trị (Admin):** Quản lý bài viết (thêm, sửa, xóa) với dữ liệu thực từ backend.
- **API Client:** Hệ thống `apiClient.ts` custom giúp quản lý base URL, xử lý tự động cookie, middleware lỗi và token.

## 📂 Cấu trúc thư mục chính

```text
blog_fe/
├── app/
│   ├── admin/         # Giao diện quản trị (ví dụ: quản lý bài viết)
│   ├── blogs/         # Trang danh sách bài viết & chi tiết
│   ├── login/         # Trang đăng nhập
│   ├── register/      # Trang đăng ký
│   ├── hooks/         # Custom React hooks (useSearch, ...)
│   ├── lib/           # Utilities (apiClient.ts, utils, ...)
│   ├── providers.tsx  # Global Providers (React Query, Toast, ...)
│   └── services/      # Các service gọi API (authService, blogService, ...)
├── components/        # Các UI Components dùng chung (Header, Sidebar, BlogCard, Toast, ...)
├── public/            # Assets tĩnh (hình ảnh, favicon, ...)
└── tailwind.config.ts # Cấu hình giao diện Tailwind
```

## ⚙️ Yêu cầu môi trường

- **Node.js**: Phiên bản 18+ trở lên.
- **pnpm**: Cài đặt thông qua npm (`npm install -g pnpm`).
- Backend **blog_be** (NestJS) đang được chạy.

## 🚀 Hướng dẫn cài đặt và khởi chạy

**Bước 1: Clone dự án và cài đặt dependencies**

```bash
cd blog_fe
pnpm install
```

**Bước 2: Cấu hình biến môi trường**

Tạo một file `.env.local` ở thư mục gốc của dự án và khai báo đường dẫn tới API Backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```
> *(Thay đổi port nếu backend NestJS của bạn đang chạy ở port khác)*

**Bước 3: Chạy môi trường phát triển (Development)**

```bash
pnpm dev
```
Mở trình duyệt và truy cập `http://localhost:3001` (hoặc port được cấp nếu 3001 đã bị chiếm).

**Bước 4: Build cho môi trường Production**

```bash
pnpm build
pnpm start
```

## 📜 Quy ước code

- **Services:** Tất cả các lệnh gọi API phải được định nghĩa trong thư mục `app/services/` và sử dụng `apiClient` từ `app/lib/apiClient.ts`.
- **UI Components:** Chỉ chứa logic hiển thị. Logic lấy dữ liệu nên được đưa vào Hooks hoặc đẩy lên page component.

---
*Created with ❤️ for Foxtek Community*
