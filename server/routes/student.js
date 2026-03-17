const express = require("express");
const router = express.Router();

const {
  getStudents,
  getStudentById
} = require("../controllers/studentController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getStudents);
router.get("/:id", getStudentById);

module.exports = router;