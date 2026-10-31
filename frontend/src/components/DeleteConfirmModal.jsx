import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, device }) {
  if (!isOpen || !device) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container delete-modal">
        <div className="modal-header">
          <div className="danger-icon-wrapper">
            <AlertTriangle size={24} className="text-danger" />
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="delete-content">
          <h3>Xác nhận xóa thiết bị?</h3>
          <p>
            Bạn có chắc chắn muốn xóa thiết bị <strong>[{device.deviceId}] {device.name}</strong> không?
            Hành động này sẽ xóa dữ liệu vĩnh viễn trên cơ sở dữ liệu MongoDB Atlas và không thể hoàn tác.
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Hủy bỏ
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm}>
            <Trash2 size={16} /> Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
