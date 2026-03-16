const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getRecentAttendance
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, markAttendance);
router.get("/recent", protect, getRecentAttendance);

module.exports = router;