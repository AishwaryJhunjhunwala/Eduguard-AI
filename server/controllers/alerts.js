const Alert = require('../models/Alert');

// @desc    Get all alerts (Admins can see all, Mentors see assigned or open)
// @route   GET /api/v1/alerts
// @access  Private/Admin/Mentor/Counselor
exports.getAlerts = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'Admin') {
      query = Alert.find().populate('student');
    } else {
      query = Alert.find({ $or: [{ assignedTo: req.user.id }, { status: 'Open' }] }).populate('student');
    }

    const alerts = await query;

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create a new alert
// @route   POST /api/v1/alerts
// @access  Private
exports.createAlert = async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);

    res.status(201).json({
      success: true,
      data: alert
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update alert status
// @route   PUT /api/v1/alerts/:id
// @access  Private/Admin/Mentor/Counselor
exports.updateAlert = async (req, res, next) => {
  try {
    let alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    // Only Admin or Assigned User can update the alert
    if (req.user.role !== 'Admin' && alert.assignedTo && alert.assignedTo.toString() !== req.user.id) {
       return res.status(403).json({ success: false, error: 'Not authorized to update this alert' });
    }

    alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: alert
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
