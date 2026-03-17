const CourseSchema = new mongoose.Schema({
  courseCode: String,
  courseName: String,
  department: String,
  mentor: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});