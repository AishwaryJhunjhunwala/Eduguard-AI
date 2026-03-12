const express = require('express');
const { getAlerts, createAlert, updateAlert } = require('../controllers/alerts');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('Admin', 'Mentor', 'Counselor'), getAlerts)
  .post(protect, authorize('Admin', 'System'), createAlert); // Assuming System or Admin can trigger alerts manually

router
  .route('/:id')
  .put(protect, authorize('Admin', 'Mentor', 'Counselor'), updateAlert);

module.exports = router;
