require("dotenv").config();
const mongoose = require("mongoose");

const StudentProfile = require("./models/StudentProfile");
const Alert = require("./models/Alert");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const createAlertsForHighRiskStudents = async () => {
  try {
    // Find all high-risk students
    const highRiskStudents = await StudentProfile.find({ dropoutRisk: 'High' }).populate('user', 'name');

    console.log(`Found ${highRiskStudents.length} high-risk students`);

    for (const student of highRiskStudents) {
      // Check if alert already exists
      const existingAlert = await Alert.findOne({
        student: student._id,
        type: 'Academic',
        severity: 'High',
        status: 'Open'
      });

      if (!existingAlert) {
        await Alert.create({
          student: student._id,
          type: 'Academic',
          severity: 'High',
          message: `Student ${student.user.name} (${student.studentId}) has been identified as high risk for dropout. Immediate intervention recommended.`,
          status: 'Open'
        });
        console.log(`Created alert for ${student.user.name}`);
      } else {
        console.log(`Alert already exists for ${student.user.name}`);
      }
    }

    console.log("Alerts creation completed");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAlertsForHighRiskStudents();