const StudentProfile = require("../models/StudentProfile");

exports.getStudents = async (req, res) => {

  const students = await StudentProfile
    .find()
    .populate("user", "name email");

  res.json(students);
};

exports.getStudentById = async (req, res) => {

  const student = await StudentProfile
    .findById(req.params.id)
    .populate("user");

  res.json(student);
};