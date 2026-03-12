const express = require('express');
const { predictDropout, analyzeSentiment } = require('../controllers/ml');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/predict-dropout/:studentId', protect, authorize('Admin', 'Mentor', 'Counselor'), predictDropout);
router.post('/analyze-sentiment', protect, analyzeSentiment);

module.exports = router;
