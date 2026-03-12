const StudentProfile = require('../models/StudentProfile');

// @desc    Get all student profiles
// @route   GET /api/v1/students
// @access  Private
exports.getStudents = async (req, res, next) => {
  try {
    const students = await StudentProfile.find().populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single student profile
// @route   GET /api/v1/students/:id
// @access  Private
exports.getStudent = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.id).populate('user', 'name email');

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create student profile
// @route   POST /api/v1/students
// @access  Private/Admin/Mentor
exports.createStudent = async (req, res, next) => {
  try {
    const student = await StudentProfile.create(req.body);

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/v1/students/:id
// @access  Private/Admin/Mentor
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await StudentProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete student profile
// @route   DELETE /api/v1/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await StudentProfile.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
