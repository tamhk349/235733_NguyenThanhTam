const express = require('express');
const router = express.Router();
const {
  getDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice
} = require('../controllers/deviceController');

// Tuyến đường /api/devices
router
  .route('/')
  .get(getDevices)
  .post(createDevice);

// Tuyến đường /api/devices/:id
router
  .route('/:id')
  .get(getDeviceById)
  .put(updateDevice)
  .delete(deleteDevice);

module.exports = router;
