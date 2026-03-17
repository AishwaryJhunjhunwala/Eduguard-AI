require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const StudentProfile = require("./models/StudentProfile");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const seedStudents = async () => {
  try {

    // Optional: clear existing students
    await StudentProfile.deleteMany({});

    const students = [
      {
        name: "Alex Johnson",
        email: "alex@eduguard.edu",
        password: "student123",
        studentId: "CS21B001",
        department: "Computer Science",
        semester: 5
      },
      {
        name: "Sam Smith",
        email: "sam@eduguard.edu",
        password: "student123",
        studentId: "CS21B002",
        department: "Computer Science",
        semester: 5
      },
      {
        name: "Jordan Lee",
        email: "jordan@eduguard.edu",
        password: "student123",
        studentId: "CS21B003",
        department: "Computer Science",
        semester: 5
      },
      {
        name: "Emily Chen",
        email: "emily@eduguard.edu",
        password: "student123",
        studentId: "CS21B004",
        department: "Computer Science",
        semester: 5
      }
    ];

    for (const student of students) {

      const user = await User.create({
        name: student.name,
        email: student.email,
        password: student.password,
        role: "Student"
      });

      await StudentProfile.create({
        user: user._id,
        studentId: student.studentId,
        department: student.department,
        semester: student.semester
      });

    }

    console.log("Students seeded successfully");

    process.exit();

  } catch (error) {

    console.error(error);
    process.exit(1);

  }
};

seedStudents();