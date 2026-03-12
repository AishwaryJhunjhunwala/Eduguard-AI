const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/students');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(protect, getStudents)
  .post(protect, authorize('Admin', 'Mentor', 'Counselor'), createStudent);

router
  .route('/:id')
  .get(protect, getStudent)
  .put(protect, authorize('Admin', 'Mentor', 'Counselor'), updateStudent)
  .delete(protect, authorize('Admin'), deleteStudent);

module.exports = router;
