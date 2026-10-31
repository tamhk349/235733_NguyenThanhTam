const mongoose = require('mongoose');
const Device = require('../models/Device');

// Helper: Tìm thiết bị theo ObjectId hoặc theo deviceId
const findDeviceByIdOrDeviceId = async (idParam) => {
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    const byId = await Device.findById(idParam);
    if (byId) return byId;
  }
  return await Device.findOne({ deviceId: idParam });
};

// @desc    Lấy danh sách thiết bị hoặc tìm kiếm theo từ khóa
// @route   GET /api/devices?search=...
// @access  Public
const getDevices = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const keyword = search.trim();
      const regex = new RegExp(keyword, 'i'); // không phân biệt hoa thường
      query = {
        $or: [
          { deviceId: regex },
          { name: regex },
          { deviceType: regex },
          { room: regex }
        ]
      };
    }

    const devices = await Device.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách thiết bị',
      error: error.message
    });
  }
};

// @desc    Xem thông tin chi tiết một thiết bị
// @route   GET /api/devices/:id
// @access  Public
const getDeviceById = async (req, res) => {
  try {
    const device = await findDeviceByIdOrDeviceId(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thiết bị với mã hoặc ID: ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xem chi tiết thiết bị',
      error: error.message
    });
  }
};

// @desc    Thêm thiết bị mới
// @route   POST /api/devices
// @access  Public
const createDevice = async (req, res) => {
  try {
    const {
      deviceId,
      name,
      deviceType,
      room,
      brand,
      model,
      quantity,
      status,
      purchaseDate,
      description
    } = req.body;

    // 1. Kiểm tra các trường bắt buộc
    if (!deviceId || !name || !deviceType || !room) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ các trường: deviceId, name, deviceType, room'
      });
    }

    // 2. Không cho phép trùng mã thiết bị deviceId
    const existing = await Device.findOne({ deviceId: deviceId.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Mã thiết bị "${deviceId}" đã tồn tại trên hệ thống, không được phép trùng lặp.`
      });
    }

    // 3. Kiểm tra status hợp lệ (nếu có truyền lên)
    const validStatuses = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái "${status}" không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`
      });
    }

    // 4. Tạo thiết bị mới
    const newDevice = await Device.create({
      deviceId: deviceId.trim(),
      name: name.trim(),
      deviceType: deviceType.trim(),
      room: room.trim(),
      brand: brand ? brand.trim() : '',
      model: model ? model.trim() : '',
      quantity: quantity ? Number(quantity) : 1,
      status: status || 'Đang sử dụng',
      purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
      description: description ? description.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Thêm thiết bị mới thành công',
      data: newDevice
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu đầu vào không hợp lệ',
        errors: messages
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi thêm thiết bị',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin thiết bị
// @route   PUT /api/devices/:id
// @access  Public
const updateDevice = async (req, res) => {
  try {
    const device = await findDeviceByIdOrDeviceId(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thiết bị để cập nhật với ID: ${req.params.id}`
      });
    }

    // Nếu người dùng muốn đổi deviceId, kiểm tra trùng lặp với thiết bị khác
    if (req.body.deviceId && req.body.deviceId.trim() !== device.deviceId) {
      const duplicate = await Device.findOne({
        deviceId: req.body.deviceId.trim(),
        _id: { $ne: device._id }
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Mã thiết bị "${req.body.deviceId}" đã thuộc về thiết bị khác.`
        });
      }
      device.deviceId = req.body.deviceId.trim();
    }

    // Kiểm tra status nếu cập nhật
    if (req.body.status) {
      const validStatuses = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: `Trạng thái "${req.body.status}" không hợp lệ. Chỉ chấp nhận: ${validStatuses.join(', ')}`
        });
      }
      device.status = req.body.status;
    }

    // Cập nhật các trường còn lại
    if (req.body.name !== undefined) device.name = req.body.name.trim();
    if (req.body.deviceType !== undefined) device.deviceType = req.body.deviceType.trim();
    if (req.body.room !== undefined) device.room = req.body.room.trim();
    if (req.body.brand !== undefined) device.brand = req.body.brand.trim();
    if (req.body.model !== undefined) device.model = req.body.model.trim();
    if (req.body.quantity !== undefined) device.quantity = Number(req.body.quantity);
    if (req.body.purchaseDate !== undefined) device.purchaseDate = new Date(req.body.purchaseDate);
    if (req.body.description !== undefined) device.description = req.body.description.trim();

    const updatedDevice = await device.save();

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thiết bị thành công',
      data: updatedDevice
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu cập nhật không hợp lệ',
        errors: messages
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thiết bị',
      error: error.message
    });
  }
};

// @desc    Xóa thiết bị
// @route   DELETE /api/devices/:id
// @access  Public
const deleteDevice = async (req, res) => {
  try {
    const device = await findDeviceByIdOrDeviceId(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thiết bị để xóa với ID: ${req.params.id}`
      });
    }

    await Device.findByIdAndDelete(device._id);

    return res.status(200).json({
      success: true,
      message: `Đã xóa thiết bị [${device.deviceId}] ${device.name} thành công`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa thiết bị',
      error: error.message
    });
  }
};

module.exports = {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
};
