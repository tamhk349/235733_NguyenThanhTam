# Stage 1: Build ứng dụng React (Vite)
FROM node:20-alpine AS build

WORKDIR /app

# Sao chép định nghĩa dependencies và cài đặt
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Biến môi trường API backend (có thể truyền qua --build-arg)
ARG VITE_API_BASE_URL=http://localhost:5000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Biên dịch mã nguồn React ra thư mục dist
RUN npm run build

# Stage 2: Phục vụ ứng dụng tĩnh bằng máy chủ web Nginx nhẹ
FROM nginx:alpine

# Sao chép file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép sản phẩm build từ stage 1 vào thư mục web của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 cho dịch vụ web
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
