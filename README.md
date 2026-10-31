# ĐỀ TÀI: XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG QUẢN LÝ THIẾT BỊ PHÒNG HỌC TRÊN NỀN TẢNG ĐÁM MÂY

- **Học phần:** Điện toán đám mây
- **Sinh viên thực hiện:** Nguyễn Thanh Tâm
- **MSSV:** 235733

---

## 1. Mô tả đề tài
Xây dựng ứng dụng quản lý thiết bị phòng học gồm frontend, backend API và cơ sở dữ liệu MongoDB Atlas. Hệ thống hỗ trợ quản lý thông tin thiết bị, theo dõi tình trạng sử dụng và cập nhật thông tin thiết bị. Sinh viên sử dụng GitHub quản lý mã nguồn, Docker đóng gói ứng dụng, Docker Hub lưu trữ image và Render triển khai hệ thống.

---

## 2. Công nghệ sử dụng
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Cơ sở dữ liệu:** MongoDB Atlas
- **Đóng gói & Triển khai:** Docker, Docker Hub, Render
- **Quản lý mã nguồn:** Git, GitHub

---

## 3. Cấu trúc dự án
```text
235733_NguyenThanhTam/
├── .gitignore          # Cấu hình bỏ qua các tệp không cần thiết và bảo mật
├── README.md           # Tài liệu hướng dẫn và mô tả dự án
├── backend/            # Mã nguồn backend (Node.js & Express API)
│   ├── .dockerignore   # Loại bỏ .env và node_modules khi build Docker
│   ├── .env.example    # Mẫu cấu hình biến môi trường
│   ├── Dockerfile      # Cấu hình đóng gói container Docker cho backend
│   ├── package.json    # Cấu hình dự án và dependencies của backend
│   └── src/            # Thư mục mã nguồn chính (config, controllers, models, routes, server.js)
└── frontend/           # Mã nguồn frontend (React)
    ├── .dockerignore   # Loại bỏ node_modules và dist khi build Docker
    ├── .env.example    # Mẫu cấu hình biến môi trường
    ├── Dockerfile      # Cấu hình đóng gói multi-stage Docker với Nginx
    ├── nginx.conf      # Cấu hình Nginx phục vụ Single Page Application
    ├── index.html      # Trang HTML chính
    ├── package.json    # Cấu hình dự án và dependencies của frontend
    ├── vite.config.js  # Cấu hình Vite bundler
    └── src/            # Thư mục giao diện và components
```

---

## 4. Hướng dẫn cài đặt và chạy chương trình (Local)

### Yêu cầu môi trường
- Đã cài đặt **Node.js** (khuyến nghị phiên bản LTS) và **npm**.

### Cài đặt và khởi chạy Backend:
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo tệp `.env` cấu hình môi trường dựa trên tệp `.env.example`.
4. Khởi chạy máy chủ:
   ```bash
   npm start
   ```

### Cài đặt và khởi chạy Frontend:
1. Mở terminal mới, di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy môi trường phát triển:
   ```bash
   npm run dev
   ```

---

## 5. Hướng dẫn chạy Backend bằng Docker

### Đóng gói Docker Image cho Backend:
```bash
docker build -t tamhk349/backend:latest ./backend
```

### Chạy Container Backend:
```bash
docker run -d -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URI="mongodb+srv://s235733_db_user:<db_password>@cluster0.p5qklmz.mongodb.net/235733_NguyenThanhTam?retryWrites=true&w=majority" \
  --name backend-service \
  tamhk349/backend:latest
```

### Kiểm tra container backend:
```bash
curl http://localhost:5000/health
```

---

## 6. Hướng dẫn chạy Frontend bằng Docker

### Đóng gói Docker Image cho Frontend:
```bash
docker build -t tamhk349/frontend:latest ./frontend
```

### Chạy Container Frontend:
```bash
docker run -d -p 80:80 --name frontend-service tamhk349/frontend:latest
```

### Kiểm tra truy cập:
Mở trình duyệt và truy cập vào: `http://localhost:80` (hoặc `http://localhost`) để sử dụng hệ thống quản lý thiết bị.

---

## 7. Triển khai Frontend trên Render
- **Loại dịch vụ:** Static Site
- **Tên dịch vụ:** `web-235733-app`
- **URL công khai:** [https://web-235733-app.onrender.com](https://web-235733-app.onrender.com)
- **Cấu hình môi trường:**
  - `VITE_API_BASE_URL`: `https://api-235733.onrender.com/api`

---

## 8. Triển khai Backend API trên Render
- **Loại dịch vụ:** Web Service
- **Tên dịch vụ:** `api-235733`
- **URL công khai:** [https://api-235733.onrender.com](https://api-235733.onrender.com)
- **Endpoint kiểm tra sức khỏe:** [https://api-235733.onrender.com/health](https://api-235733.onrender.com/health)
- **Endpoint API thiết bị:** [https://api-235733.onrender.com/api/devices](https://api-235733.onrender.com/api/devices)
- **Cấu hình môi trường:**
  - `PORT`: `5000`
  - `MONGO_URI`: Kết nối cơ sở dữ liệu MongoDB Atlas
