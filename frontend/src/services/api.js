const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiService = {
  // Lấy danh sách thiết bị hoặc tìm kiếm
  getDevices: async (search = '') => {
    const url = search ? `${API_BASE_URL}/devices?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/devices`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi khi tải danh sách thiết bị');
    return data;
  },

  // Xem chi tiết một thiết bị
  getDeviceById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/devices/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi khi xem chi tiết thiết bị');
    return data;
  },

  // Thêm thiết bị mới
  createDevice: async (deviceData) => {
    const res = await fetch(`${API_BASE_URL}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi khi thêm thiết bị mới');
    return data;
  },

  // Cập nhật thông tin thiết bị
  updateDevice: async (id, deviceData) => {
    const res = await fetch(`${API_BASE_URL}/devices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi khi cập nhật thông tin thiết bị');
    return data;
  },

  // Xóa thiết bị
  deleteDevice: async (id) => {
    const res = await fetch(`${API_BASE_URL}/devices/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Lỗi khi xóa thiết bị');
    return data;
  }
};
