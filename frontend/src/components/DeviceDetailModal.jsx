import React from 'react';
import { X, CheckCircle, Clock, AlertTriangle, XCircle, Tag, MapPin, Calendar, Layers, Hash } from 'lucide-react';

export default function DeviceDetailModal({ isOpen, onClose, device }) {
  if (!isOpen || !device) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang sử dụng':
        return <span className="badge badge-success"><CheckCircle size={14} /> {status}</span>;
      case 'Đang sửa chữa':
        return <span className="badge badge-warning"><Clock size={14} /> {status}</span>;
      case 'Hư hỏng':
        return <span className="badge badge-danger"><AlertTriangle size={14} /> {status}</span>;
      case 'Ngừng sử dụng':
      default:
        return <span className="badge badge-neutral"><XCircle size={14} /> {status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container detail-modal">
        <div className="modal-header">
          <div className="title-with-badge">
            <h3>Chi tiết thiết bị: {device.deviceId}</h3>
            {getStatusBadge(device.status)}
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          <h2 className="detail-title">{device.name}</h2>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label"><Hash size={16} /> Mã thiết bị</span>
              <span className="detail-value highlight">{device.deviceId}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label"><Tag size={16} /> Loại thiết bị</span>
              <span className="detail-value">{device.deviceType}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label"><MapPin size={16} /> Phòng học sử dụng</span>
              <span className="detail-value font-medium">{device.room}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label"><Layers size={16} /> Số lượng</span>
              <span className="detail-value">{device.quantity} cái/bộ</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Hãng sản xuất</span>
              <span className="detail-value">{device.brand || 'Chưa cập nhật'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Model thiết bị</span>
              <span className="detail-value">{device.model || 'Chưa cập nhật'}</span>
            </div>

            <div className="detail-item full-width">
              <span className="detail-label"><Calendar size={16} /> Ngày mua / tiếp nhận</span>
              <span className="detail-value">{formatDate(device.purchaseDate)}</span>
            </div>

            <div className="detail-item full-width">
              <span className="detail-label">Mô tả / Ghi chú</span>
              <p className="detail-description">{device.description || 'Không có mô tả nào.'}</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
