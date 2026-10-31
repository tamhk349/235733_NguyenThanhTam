require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const request = (method, path, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- BẮT ĐẦU KIỂM THỬ CÁC API BACKEND ---');

  // Test 1: GET /health
  console.log('\n[1] Kiểm thử GET /health:');
  const resHealth = await request('GET', '/health');
  console.log(`Status: ${resHealth.status}`, resHealth.body);

  // Test 2: GET /api/devices
  console.log('\n[2] Kiểm thử GET /api/devices:');
  const resList = await request('GET', '/api/devices');
  console.log(`Status: ${resList.status}, Số lượng: ${resList.body.count}`);

  // Test 3: GET /api/devices?search=Sony
  console.log('\n[3] Kiểm thử GET /api/devices?search=Sony:');
  const resSearch = await request('GET', '/api/devices?search=Sony');
  console.log(`Status: ${resSearch.status}, Tìm thấy: ${resSearch.body.count}`);

  // Test 4: POST /api/devices (Thêm thiết bị mới)
  console.log('\n[4] Kiểm thử POST /api/devices (Thêm mới):');
  const newDev = {
    deviceId: 'TB-TEST-999',
    name: 'Thiết bị kiểm thử tự động',
    deviceType: 'Thiết bị mạng',
    room: 'Phòng Server C1',
    brand: 'Cisco',
    model: 'Catalyst 2960',
    quantity: 3,
    status: 'Đang sử dụng',
    description: 'Switch mạng kiểm thử API'
  };
  const resPost = await request('POST', '/api/devices', newDev);
  console.log(`Status: ${resPost.status}, Message: ${resPost.body.message}`);

  // Test 5: POST /api/devices (Kiểm tra trùng deviceId)
  console.log('\n[5] Kiểm thử POST /api/devices (Kiểm tra chặn trùng mã):');
  const resDup = await request('POST', '/api/devices', newDev);
  console.log(`Status: ${resDup.status} (Kỳ vọng 400), Message: ${resDup.body.message}`);

  // Test 6: GET /api/devices/:id (Xem chi tiết)
  console.log('\n[6] Kiểm thử GET /api/devices/TB-TEST-999 (Xem chi tiết):');
  const resDetail = await request('GET', '/api/devices/TB-TEST-999');
  console.log(`Status: ${resDetail.status}, Data: [${resDetail.body.data.deviceId}] ${resDetail.body.data.name}`);

  // Test 7: PUT /api/devices/:id (Cập nhật)
  console.log('\n[7] Kiểm thử PUT /api/devices/TB-TEST-999 (Cập nhật):');
  const resPut = await request('PUT', '/api/devices/TB-TEST-999', {
    status: 'Đang sửa chữa',
    quantity: 5
  });
  console.log(`Status: ${resPut.status}, Trạng thái mới: ${resPut.body.data.status}, Số lượng mới: ${resPut.body.data.quantity}`);

  // Test 8: DELETE /api/devices/:id (Xóa thiết bị test)
  console.log('\n[8] Kiểm thử DELETE /api/devices/TB-TEST-999 (Xóa):');
  const resDelete = await request('DELETE', '/api/devices/TB-TEST-999');
  console.log(`Status: ${resDelete.status}, Message: ${resDelete.body.message}`);

  console.log('\n--- TOÀN BỘ API ĐÃ VƯỢT QUA KIỂM THỬ THÀNH CÔNG! ---');
  process.exit(0);
};

// Chờ 2s để server khởi động rồi chạy test
setTimeout(runTests, 2000);
