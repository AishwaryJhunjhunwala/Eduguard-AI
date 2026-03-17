const CounselingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "StudentProfile"
  },
  counselor: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  notes: String,
  sessionDate: Date,
  status: {
    type: String,
    enum: ["Scheduled", "Completed"]
  }
});