const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "StudentProfile"
  },
  course: String,
  status: {
    type: String,
    enum: ["Present", "Absent", "Late"]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);