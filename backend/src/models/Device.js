const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: [true, 'Mã thiết bị không được để trống'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Tên thiết bị không được để trống'],
      trim: true
    },
    deviceType: {
      type: String,
      required: [true, 'Loại thiết bị không được để trống'],
      trim: true
    },
    room: {
      type: String,
      required: [true, 'Phòng học sử dụng không được để trống'],
      trim: true
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    model: {
      type: String,
      trim: true,
      default: ''
    },
    quantity: {
      type: Number,
      required: [true, 'Số lượng không được để trống'],
      min: [1, 'Số lượng tối thiểu là 1'],
      default: 1
    },
    status: {
      type: String,
      required: [true, 'Tình trạng thiết bị không được để trống'],
      enum: {
        values: ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'],
        message: 'Trạng thái {VALUE} không hợp lệ'
      },
      default: 'Đang sử dụng'
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    description: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'devices'
  }
);

module.exports = mongoose.model('Device', deviceSchema);
