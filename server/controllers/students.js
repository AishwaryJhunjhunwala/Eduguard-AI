const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const axios = require('axios');

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
    const { name, email, password, studentId, rollNumber, department, semester, attendancePercentage, attendance, cgpa, marks, assignments } = req.body;
    
    // 1. Create User
    const user = await User.create({
      name,
      email,
      password: password || 'student123',
      role: 'Student'
    });

    // 2. Mock or real AI prediction logic
    let riskLevel = 'Not Assessed';
    let predictionScore = 0;
    
    // Normalize properties
    const finalRoll = rollNumber || studentId || `STU${Math.floor(Math.random() * 100000)}`;
    const finalMarks = marks !== undefined ? marks : (cgpa ? cgpa * 10 : 80);
    const finalAttendance = attendance !== undefined ? attendance : (attendancePercentage !== undefined ? attendancePercentage : 100);

    const studentData = {
        Number_of_Absences: Math.floor((100 - finalAttendance) / 5),
        Grade_2: (finalMarks / 100) * 20, 
        Age: 18 
    };

    try {
      const mlResponse = await axios.post('http://localhost:8000/predict', studentData);
      if (mlResponse.data) {
        const rScore = mlResponse.data.risk_score || Math.random();
        if (rScore > 0.7) riskLevel = 'High';
        else if (rScore > 0.4) riskLevel = 'Medium';
        else riskLevel = 'Low';
        predictionScore = Math.floor((1 - rScore) * 100); 
      }
    } catch (apiErr) {
      console.warn('Python ML service unreachable for new student. Mocking data.');
      const mockRiskLevels = ['Low', 'Medium', 'High'];
      riskLevel = mockRiskLevels[Math.floor(Math.random() * mockRiskLevels.length)];
      predictionScore = Math.floor(Math.random() * 100);
    }

    // 3. Create Profile
    const studentProfile = await StudentProfile.create({
      user: user._id,
      studentId: finalRoll,
      rollNumber: finalRoll,
      department: department || 'General',
      semester: semester || 1,
      attendancePercentage: finalAttendance,
      attendance: finalAttendance,
      cgpa: finalMarks / 10,
      marks: finalMarks,
      assignments: assignments || 0,
      dropoutRisk: riskLevel,
      riskLevel: riskLevel,
      predictionScore: predictionScore,
      riskScore: 100 - predictionScore
    });

    const populatedProfile = await StudentProfile.findById(studentProfile._id).populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedProfile
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
