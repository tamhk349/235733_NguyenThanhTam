require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const deviceRoutes = require('./routes/deviceRoutes');

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối cơ sở dữ liệu MongoDB Atlas
connectDB();

// Cấu hình Middleware
app.use(cors({
  origin: '*', // Cho phép mọi origin để dễ dàng kết nối frontend local & Render
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tuyến đường mặc định: Chuyển hướng trực tiếp đến danh sách thiết bị
app.get(['/', '/api'], (req, res) => {
  res.redirect('/api/devices');
});

// Endpoint kiểm tra sức khỏe hệ thống (Health Check)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  return res.status(200).json({
    status: 'OK',
    message: 'Backend server đang hoạt động bình thường',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || '235733_NguyenThanhTam'
    }
  });
});

// Định tuyến API quản lý thiết bị
app.use('/api/devices', deviceRoutes);

// Xử lý route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`
  });
});

// Middleware xử lý lỗi toàn cục (500)
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi nội bộ máy chủ',
    error: err.message
  });
});

// Cấu hình cổng chạy từ biến môi trường
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại: http://localhost:${PORT}`);
  console.log(`Endpoint kiểm tra sức khỏe: http://localhost:${PORT}/health`);
  console.log(`Endpoint quản lý thiết bị: http://localhost:${PORT}/api/devices`);
});
