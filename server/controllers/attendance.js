const Attendance = require("../models/AttendanceCollection");

exports.markAttendance = async (req, res) => {

  const { studentId, course, status } = req.body;

  const attendance = await Attendance.create({
    student: studentId,
    course,
    status
  });

  res.json(attendance);
};

exports.getRecentAttendance = async (req, res) => {

  const records = await Attendance
    .find()
    .populate({
      path: "student",
      populate: { path: "user", select: "name" }
    })
    .sort({ date: -1 })
    .limit(10);

  res.json(records);
};