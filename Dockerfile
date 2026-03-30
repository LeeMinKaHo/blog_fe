# 1. Chọn base image (Node.js 20)
FROM node:20-alpine

# Cài đặt pnpm do project FE của bạn sử dụng pnpm
RUN npm install -g pnpm

# 2. Thư mục làm việc
WORKDIR /usr/src/app

# 3. Copy dependencies và lock file
COPY package.json pnpm-lock.yaml ./

# 4. Cài đặt dependencies
RUN pnpm install

# 5. Copy toàn bộ source code
COPY . .

# 6. Build ứng dụng Next.js
# Cần truyền tham số môi trường lúc build nếu cần (như API URL)
RUN pnpm build

# 7. Mở port cho Next.js
EXPOSE 3001

# 8. Chạy ứng dụng
CMD ["pnpm", "start", "--port", "3001"]
