const express = require('express');
const router = express.Router();

const Student = require('../../models/StudentProfile');

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name');

    // 🔥 Risk Distribution
    const riskData = [
      { name: 'Low Risk', value: students.filter(s => s.dropoutRisk === 'Low').length },
      { name: 'Medium Risk', value: students.filter(s => s.dropoutRisk === 'Medium').length },
      { name: 'High Risk', value: students.filter(s => s.dropoutRisk === 'High').length },
    ];

    // 🔥 High Risk Students
    const highRiskStudents = students
      .filter(s => s.dropoutRisk === 'High')
      .slice(0, 5)
      .map(s => ({
        _id: s._id,
        name: s.user?.name || "N/A",
        studentId: s.studentId,
        attendancePercentage: s.attendancePercentage,
        riskScore: s.riskScore,
        dropoutRisk: s.dropoutRisk
      }));

    // 🔥 Attendance Trends (dummy derived for now)
    const attendanceData = [
      { name: 'Mon', percentage: avg(students, 'attendancePercentage') - 2 },
      { name: 'Tue', percentage: avg(students, 'attendancePercentage') },
      { name: 'Wed', percentage: avg(students, 'attendancePercentage') + 1 },
      { name: 'Thu', percentage: avg(students, 'attendancePercentage') - 3 },
      { name: 'Fri', percentage: avg(students, 'attendancePercentage') + 2 },
    ];

    // 🔥 Performance Data
    const performanceData = [
      { name: 'Overall', score: avg(students, 'cgpa') * 10 }
    ];

    // 🔥 Helper function
    function avg(arr, field) {
      if (!arr.length) return 0;
      return Math.round(arr.reduce((sum, s) => sum + (s[field] || 0), 0) / arr.length);
    }

    res.json({
      success: true,
      totalStudents: students.length,
      riskData,
      highRiskStudents,
      attendanceData,
      performanceData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;