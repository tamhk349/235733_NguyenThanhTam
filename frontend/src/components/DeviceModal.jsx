import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const STATUS_OPTIONS = ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'];
const TYPE_OPTIONS = [
  'Máy chiếu',
  'Máy tính',
  'Thiết bị âm thanh',
  'Điều hòa',
  'Bảng thông minh',
  'Camera',
  'Thiết bị mạng',
  'Khác'
];

export default function DeviceModal({ isOpen, onClose, onSave, device = null }) {
  const isEdit = !!device;

  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    deviceType: 'Máy chiếu',
    room: '',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (device) {
      setFormData({
        deviceId: device.deviceId || '',
        name: device.name || '',
        deviceType: device.deviceType || 'Máy chiếu',
        room: device.room || '',
        brand: device.brand || '',
        model: device.model || '',
        quantity: device.quantity ?? 1,
        status: device.status || 'Đang sử dụng',
        purchaseDate: device.purchaseDate ? new Date(device.purchaseDate).toISOString().split('T')[0] : '',
        description: device.description || ''
      });
    } else {
      setFormData({
        deviceId: '',
        name: '',
        deviceType: 'Máy chiếu',
        room: '',
        brand: '',
        model: '',
        quantity: 1,
        status: 'Đang sử dụng',
        purchaseDate: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
    setErrors({});
  }, [device, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.deviceId.trim()) newErrors.deviceId = 'Mã thiết bị không được để trống';
    if (!formData.name.trim()) newErrors.name = 'Tên thiết bị không được để trống';
    if (!formData.deviceType.trim()) newErrors.deviceType = 'Vui lòng chọn loại thiết bị';
    if (!formData.room.trim()) newErrors.room = 'Phòng học sử dụng không được để trống';
    if (Number(formData.quantity) <= 0) newErrors.quantity = 'Số lượng phải lớn hơn 0';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{isEdit ? 'Cập nhật thông tin thiết bị' : 'Thêm thiết bị mới'}</h3>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Mã thiết bị */}
            <div className="form-group">
              <label>Mã thiết bị (deviceId) <span className="req">*</span></label>
              <input
                type="text"
                name="deviceId"
                value={formData.deviceId}
                onChange={handleChange}
                placeholder="VD: TB-MC-101"
                disabled={isEdit}
                className={errors.deviceId ? 'input-error' : ''}
              />
              {errors.deviceId && <span className="error-text"><AlertCircle size={14} /> {errors.deviceId}</span>}
            </div>

            {/* Tên thiết bị */}
            <div className="form-group">
              <label>Tên thiết bị <span className="req">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VD: Máy chiếu Sony Laser"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text"><AlertCircle size={14} /> {errors.name}</span>}
            </div>

            {/* Loại thiết bị */}
            <div className="form-group">
              <label>Loại thiết bị <span className="req">*</span></label>
              <select name="deviceType" value={formData.deviceType} onChange={handleChange}>
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Phòng học */}
            <div className="form-group">
              <label>Phòng học sử dụng <span className="req">*</span></label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                placeholder="VD: Phòng A101, Lab 202"
                className={errors.room ? 'input-error' : ''}
              />
              {errors.room && <span className="error-text"><AlertCircle size={14} /> {errors.room}</span>}
            </div>

            {/* Hãng sản xuất */}
            <div className="form-group">
              <label>Hãng sản xuất</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="VD: Sony, Dell, Shure"
              />
            </div>

            {/* Model */}
            <div className="form-group">
              <label>Model thiết bị</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="VD: VPL-EX455"
              />
            </div>

            {/* Số lượng */}
            <div className="form-group">
              <label>Số lượng <span className="req">*</span></label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className={errors.quantity ? 'input-error' : ''}
              />
              {errors.quantity && <span className="error-text"><AlertCircle size={14} /> {errors.quantity}</span>}
            </div>

            {/* Tình trạng */}
            <div className="form-group">
              <label>Tình trạng thiết bị <span className="req">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange}>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Ngày mua/tiếp nhận */}
            <div className="form-group full-width">
              <label>Ngày mua hoặc tiếp nhận</label>
              <input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>

            {/* Mô tả */}
            <div className="form-group full-width">
              <label>Mô tả, ghi chú</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập thông tin mô tả chi tiết, vị trí hoặc tình trạng cụ thể..."
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy bỏ
            </button>
            <button type="submit" className="btn-primary">
              <Save size={18} /> {isEdit ? 'Lưu thay đổi' : 'Thêm thiết bị'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
