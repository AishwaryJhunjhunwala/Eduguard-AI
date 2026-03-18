const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getRecentAttendance
} = require("../controllers/attendance");

const { protect } = require("../middleware/auth");

router.post("/", protect, markAttendance);
router.get("/recent", protect, getRecentAttendance);

module.exports = router;