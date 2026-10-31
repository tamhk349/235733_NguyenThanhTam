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
│   ├── .env.example    # Mẫu cấu hình biến môi trường
│   ├── package.json    # Cấu hình dự án và dependencies của backend
│   └── server.js       # Tệp khởi chạy server
└── frontend/           # Mã nguồn frontend (React)
    ├── .env.example    # Mẫu cấu hình biến môi trường
    ├── index.html      # Trang HTML chính
    ├── package.json    # Cấu hình dự án và dependencies của frontend
    ├── vite.config.js  # Cấu hình Vite bundler
    └── src/
        ├── App.jsx     # Giao diện chính của ứng dụng
        └── main.jsx    # Điểm khởi chạy React DOM
```

---

## 4. Hướng dẫn cài đặt và chạy chương trình

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
