const express = require("express");
const router = express.Router();

const {
  getStudents,
  getStudentById
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getStudents);
router.get("/:id", protect, getStudentById);

module.exports = router;