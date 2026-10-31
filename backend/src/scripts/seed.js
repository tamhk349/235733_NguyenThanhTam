require('dotenv').config();
const mongoose = require('mongoose');
const Device = require('../models/Device');

const sampleDevices = [
  {
    deviceId: 'TB-MC-001',
    name: 'Máy chiếu Sony Laser Full HD',
    deviceType: 'Máy chiếu',
    room: 'Phòng A101',
    brand: 'Sony',
    model: 'VPL-EX455',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: new Date('2023-09-15'),
    description: 'Máy chiếu độ sáng cao phục vụ giảng dạy lý thuyết tại giảng đường A1'
  },
  {
    deviceId: 'TB-PC-002',
    name: 'Bộ máy tính bàn Dell OptiPlex',
    deviceType: 'Máy tính',
    room: 'Phòng Lab 202',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    quantity: 25,
    status: 'Đang sử dụng',
    purchaseDate: new Date('2023-10-01'),
    description: 'Dàn máy tính cấu hình Core i5, 16GB RAM dành cho sinh viên thực hành lập trình'
  },
  {
    deviceId: 'TB-AT-003',
    name: 'Hệ thống âm thanh trợ giảng không dây',
    deviceType: 'Thiết bị âm thanh',
    room: 'Phòng B305',
    brand: 'Shure',
    model: 'SVX288',
    quantity: 2,
    status: 'Đang sửa chữa',
    purchaseDate: new Date('2024-01-20'),
    description: 'Bộ âm ly kèm 2 micro không dây phục vụ hội thảo và phòng học lớn'
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('Lỗi: Chưa cấu hình biến môi trường MONGO_URI trong file .env');
      process.exit(1);
    }

    console.log('Đang kết nối tới MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Kết nối thành công!');

    // Xóa dữ liệu cũ nếu có và nạp dữ liệu mẫu
    await Device.deleteMany({});
    console.log('Đã làm sạch collection devices.');

    const createdDevices = await Device.insertMany(sampleDevices);
    console.log(`Đã nạp thành công ${createdDevices.length} bản ghi mẫu:`);
    createdDevices.forEach((dev) => {
      console.log(` - [${dev.deviceId}] ${dev.name} (${dev.deviceType}) - Trạng thái: ${dev.status}`);
    });

    console.log('Hoàn thành nạp dữ liệu cho Câu 2!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error.message);
    process.exit(1);
  }
};

seedData();
