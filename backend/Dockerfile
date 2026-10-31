# Sử dụng image Node.js LTS nhẹ trên nền Alpine Linux
FROM node:20-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép các tệp định nghĩa dependencies
COPY package*.json ./

# Cài đặt các thư viện phụ thuộc (chỉ cài production dependencies)
RUN npm install --omit=dev

# Sao chép mã nguồn backend
COPY src ./src

# Cấu hình cổng chạy mặc định
ENV PORT=5000
EXPOSE 5000

# Lệnh khởi chạy ứng dụng backend
CMD ["npm", "start"]
