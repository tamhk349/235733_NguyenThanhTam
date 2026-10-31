import React, { useState, useEffect, useMemo } from 'react';
import {
  Monitor,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  Database,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';
import { apiService } from './services/api';
import DeviceModal from './components/DeviceModal';
import DeviceDetailModal from './components/DeviceDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailDevice, setDetailDevice] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteDeviceTarget, setDeleteDeviceTarget] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  // Fetch devices from backend
  const fetchDevices = async (search = '') => {
    try {
      setLoading(true);
      const res = await apiService.getDevices(search);
      setDevices(res.data || []);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Không thể tải danh sách thiết bị' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDevices(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = devices.length;
    const inUse = devices.filter((d) => d.status === 'Đang sử dụng').length;
    const repairing = devices.filter((d) => d.status === 'Đang sửa chữa').length;
    const broken = devices.filter((d) => d.status === 'Hư hỏng').length;
    const discontinued = devices.filter((d) => d.status === 'Ngừng sử dụng').length;
    return { total, inUse, repairing, broken, discontinued };
  }, [devices]);

  // Filtered devices by status filter
  const displayedDevices = useMemo(() => {
    if (statusFilter === 'ALL') return devices;
    return devices.filter((d) => d.status === statusFilter);
  }, [devices, statusFilter]);

  // Handle Save (Add or Update)
  const handleSaveDevice = async (formData) => {
    try {
      if (selectedDevice) {
        // Cập nhật
        await apiService.updateDevice(selectedDevice._id || selectedDevice.deviceId, formData);
        setToast({ type: 'success', message: 'Cập nhật thiết bị thành công!' });
      } else {
        // Thêm mới
        await apiService.createDevice(formData);
        setToast({ type: 'success', message: 'Thêm thiết bị mới thành công!' });
      }
      setIsModalOpen(false);
      setSelectedDevice(null);
      fetchDevices(searchTerm);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteDeviceTarget) return;
    try {
      await apiService.deleteDevice(deleteDeviceTarget._id || deleteDeviceTarget.deviceId);
      setToast({ type: 'success', message: `Đã xóa thiết bị ${deleteDeviceTarget.deviceId} thành công!` });
      setIsDeleteOpen(false);
      setDeleteDeviceTarget(null);
      fetchDevices(searchTerm);
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang sử dụng':
        return <span className="badge badge-success"><CheckCircle size={13} /> {status}</span>;
      case 'Đang sửa chữa':
        return <span className="badge badge-warning"><Clock size={13} /> {status}</span>;
      case 'Hư hỏng':
        return <span className="badge badge-danger"><AlertTriangle size={13} /> {status}</span>;
      case 'Ngừng sử dụng':
      default:
        return <span className="badge badge-neutral"><XCircle size={13} /> {status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-logo">
            <div className="logo-icon">
              <Monitor size={26} />
            </div>
            <div>
              <h1>Quản Lý Thiết Bị Phòng Học</h1>
              <p className="subtitle">Hệ thống triển khai trên nền tảng Điện toán đám mây</p>
            </div>
          </div>
          <div className="user-badge">
            <span className="user-name">Nguyễn Thanh Tâm</span>
            <span className="user-mssv">MSSV: 235733</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Stat Cards */}
        <section className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon"><Layers size={22} /></div>
            <div>
              <p className="stat-label">Tổng số thiết bị</p>
              <h3 className="stat-value">{stats.total}</h3>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon"><CheckCircle size={22} /></div>
            <div>
              <p className="stat-label">Đang sử dụng</p>
              <h3 className="stat-value">{stats.inUse}</h3>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon"><Clock size={22} /></div>
            <div>
              <p className="stat-label">Đang sửa chữa</p>
              <h3 className="stat-value">{stats.repairing}</h3>
            </div>
          </div>

          <div className="stat-card stat-danger">
            <div className="stat-icon"><AlertTriangle size={22} /></div>
            <div>
              <p className="stat-label">Hư hỏng</p>
              <h3 className="stat-value">{stats.broken}</h3>
            </div>
          </div>
        </section>

        {/* Content Box */}
        <section className="content-card">
          {/* Action Toolbar */}
          <div className="toolbar-header">
            <div className="search-bar">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo mã, tên thiết bị, loại hoặc phòng học..."
              />
              {searchTerm && (
                <button className="btn-clear" onClick={() => setSearchTerm('')} aria-label="Xóa tìm kiếm">
                  &times;
                </button>
              )}
            </div>

            <div className="toolbar-actions">
              <button
                className="btn-refresh"
                onClick={() => fetchDevices(searchTerm)}
                title="Làm mới dữ liệu"
              >
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setSelectedDevice(null);
                  setIsModalOpen(true);
                }}
              >
                <Plus size={18} /> Thêm thiết bị mới
              </button>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="filter-tabs">
            {['ALL', 'Đang sử dụng', 'Đang sửa chữa', 'Hư hỏng', 'Ngừng sử dụng'].map((st) => (
              <button
                key={st}
                className={`tab-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'ALL' ? 'Tất cả trạng thái' : st}
              </button>
            ))}
          </div>

          {/* Devices Table */}
          <div className="table-responsive">
            <table className="device-table">
              <thead>
                <tr>
                  <th>Mã thiết bị</th>
                  <th>Tên thiết bị</th>
                  <th>Loại</th>
                  <th>Phòng học</th>
                  <th>Số lượng</th>
                  <th>Tình trạng</th>
                  <th>Ngày tiếp nhận</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="table-loading">
                      <div className="spinner"></div>
                      <span>Đang tải dữ liệu từ máy chủ đám mây...</span>
                    </td>
                  </tr>
                ) : displayedDevices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="table-empty">
                      <Database size={40} />
                      <p>Không tìm thấy thiết bị nào phù hợp</p>
                    </td>
                  </tr>
                ) : (
                  displayedDevices.map((dev) => (
                    <tr key={dev._id || dev.deviceId}>
                      <td className="code-cell font-mono">{dev.deviceId}</td>
                      <td>
                        <div className="device-name-group">
                          <span className="device-name">{dev.name}</span>
                          {(dev.brand || dev.model) && (
                            <span className="device-sub">
                              {[dev.brand, dev.model].filter(Boolean).join(' - ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="type-badge">{dev.deviceType}</span>
                      </td>
                      <td>
                        <span className="room-badge">
                          <MapPin size={13} /> {dev.room}
                        </span>
                      </td>
                      <td className="font-semibold">{dev.quantity}</td>
                      <td>{getStatusBadge(dev.status)}</td>
                      <td className="text-muted text-sm">{formatDate(dev.purchaseDate)}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-icon btn-view"
                          onClick={() => {
                            setDetailDevice(dev);
                            setIsDetailOpen(true);
                          }}
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => {
                            setSelectedDevice(dev);
                            setIsModalOpen(true);
                          }}
                          title="Cập nhật thông tin"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => {
                            setDeleteDeviceTarget(dev);
                            setIsDeleteOpen(true);
                          }}
                          title="Xóa thiết bị"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Modals */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDevice(null);
        }}
        onSave={handleSaveDevice}
        device={selectedDevice}
      />

      <DeviceDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailDevice(null);
        }}
        device={detailDevice}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteDeviceTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        device={deleteDeviceTarget}
      />
    </div>
  );
}
