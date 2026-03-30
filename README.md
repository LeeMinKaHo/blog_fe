# 🎨 Foxtek Blog Frontend (Next.js)

Giao diện người dùng hiện đại cho nền tảng **Foxtek Blog**, được xây dựng với các công nghệ web tiên tiến nhất (**Next.js 16**, **React 19**, **Tailwind CSS 4**). Dự án tối ưu hóa hiệu suất, SEO và trải nghiệm người dùng real-time.

---

## 🚀 Công nghệ sử dụng

### Core Stack
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Ngôn ngữ:** TypeScript

### Ecosystem
- **State Management & Fetching:** [TanStack Query v5](https://tanstack.com/query/latest) & SWR
- **Editor:** [Tiptap](https://tiptap.dev/) (Rich text editor tích hợp Image, Youtube, Link)
- **Real-time:** [Socket.io-client](https://socket.io/)
- **Forms:** React Hook Form & Zod validation
- **Visualization:** [Recharts](https://recharts.org/)
- **Icons:** Lucide React

---

## ✨ Tính năng nổi bật

### 🌐 Trải nghiệm người dùng
- **Real-time Notifications:** Nhận thông báo tức thì khi có tương tác mới qua Socket.io.
- **Dynamic Search:** Tìm kiếm bài viết thông minh với debounce và bộ lọc danh mục.
- **Responsive Design:** Giao diện tương thích hoàn hảo trên mọi thiết bị (Mobile, Tablet, Desktop).
- **Smooth Interaction:** Loading skeletons, mượt mà với Framer Motion (nếu có) và Toast notifications.

### 🔐 Authentication
- Luồng đăng ký/đăng nhập chuyên nghiệp.
- Xác thực bảo mật với OTP.
- Quản lý trạng thái đăng nhập qua Server Context & Client Providers.

### ✍️ Content Creation
- Trình soạn thảo **Tiptap** mạnh mẽ, hỗ trợ chèn ảnh, video Youtube và định dạng văn bản phong phú.
- Quản lý bài viết nháp và xuất bản.

### 📊 Admin Dashboard
- Trang quản trị dành riêng cho việc quản lý bài viết, người dùng và danh mục.
- Biểu đồ thống kê trực quan sử dụng **Recharts**.

### 👥 Author Profiles
- Trang cá nhân công khai hiển thị thông tin tác giả và danh sách bài viết.
- Tính năng Follow/Unfollow thời gian thực.

---

## 📂 Cấu trúc thư mục

```text
blog_fe/
├── app/               # Next.js App Router (Pages, Layouts, API configs)
├── components/        # Thư mục UI Components (Atom, Molecule, Organism)
│   ├── admin/         # Components dành cho trang quản trị
│   ├── blog/          # Components liên quan đến bài viết
│   ├── layout/        # Header, Footer, Sidebar
│   └── ui/            # Common UI elements (Button, Input, Modal)
├── hooks/             # Custom React hooks
├── lib/               # Utility functions & API Client configuration
├── services/          # Các hàm gọi API (Auth, Blog, User services)
├── public/            # Assets tĩnh
└── tailwind.config.ts # Cấu hình Tailwind CSS
```

---

## ⚙️ Hướng dẫn khởi chạy

### 1. Yêu cầu
- **Node.js** v20+
- **pnpm** (Khuyên dùng)

### 2. Cài đặt

```bash
# Cài đặt dependencies
pnpm install

# Cấu hình biến môi trường (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Phát triển

```bash
pnpm dev
```
Truy cập: `http://localhost:3001`

---

## 📜 Quy ước Code

- **Component-driven:** Chia nhỏ component để tái sử dụng.
- **Type Safety:** Luôn định nghĩa interface/type cho props và dữ liệu API.
- **Performance:** Sử dụng Server Components cho nội dung tĩnh và Client Components cho tương tác.

---
*Building a fast and beautiful blog experience for Foxtek Community.*
