const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  type: {
    type: String,
    enum: ['Academic', 'Behavioral', 'Emotional', 'System'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please add an alert message']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Usually a Mentor or Counselor
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);
