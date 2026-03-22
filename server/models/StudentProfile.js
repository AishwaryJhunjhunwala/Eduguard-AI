const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: [true, 'Please add a student ID'],
    unique: true
  },
  rollNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  semester: {
    type: Number,
    required: [true, 'Please add the current semester']
  },
  attendancePercentage: {
    type: Number,
    default: 100
  },
  attendance: {
    type: Number,
    default: 100
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  marks: {
    type: Number,
    default: 0
  },
  assignments: {
    type: Number,
    default: 0
  },
  feePaymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue'],
    default: 'Paid'
  },
  engagementScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100 // Out of 100, calculated based on LMS activity
  },
  dropoutRisk: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Not Assessed'],
    default: 'Not Assessed'
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Not Assessed'],
    default: 'Not Assessed'
  },
  mentalHealthStatus: {
    type: String,
    enum: ['Stable', 'Stressed', 'Anxious', 'Disengaged', 'Unknown'],
    default: 'Unknown'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  riskScore: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
},
predictionScore: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
},

performanceScore: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
}
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
