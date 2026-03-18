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

    await StudentProfile.deleteMany({});

      const students = [
  {
    name: "Aman Verma",
    email: "aman.verma21@college.edu",
    password: "student123",
    studentId: "CS21B001",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Rohit Sharma",
    email: "rohit.sharma21@college.edu",
    password: "student123",
    studentId: "CS21B002",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Priya Singh",
    email: "priya.singh21@college.edu",
    password: "student123",
    studentId: "CS21B003",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Sneha Gupta",
    email: "sneha.gupta21@college.edu",
    password: "student123",
    studentId: "CS21B004",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Karan Mehta",
    email: "karan.mehta21@college.edu",
    password: "student123",
    studentId: "CS21B005",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Ankit Yadav",
    email: "ankit.yadav21@college.edu",
    password: "student123",
    studentId: "CS21B006",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Neha Kapoor",
    email: "neha.kapoor21@college.edu",
    password: "student123",
    studentId: "CS21B007",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Rahul Das",
    email: "rahul.das21@college.edu",
    password: "student123",
    studentId: "CS21B008",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Pooja Nair",
    email: "pooja.nair21@college.edu",
    password: "student123",
    studentId: "CS21B009",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Arjun Reddy",
    email: "arjun.reddy21@college.edu",
    password: "student123",
    studentId: "CS21B010",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Vikas Patel",
    email: "vikas.patel21@college.edu",
    password: "student123",
    studentId: "CS21B011",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Deepak Kumar",
    email: "deepak.kumar21@college.edu",
    password: "student123",
    studentId: "CS21B012",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Shreya Bose",
    email: "shreya.bose21@college.edu",
    password: "student123",
    studentId: "CS21B013",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Aditya Joshi",
    email: "aditya.joshi21@college.edu",
    password: "student123",
    studentId: "CS21B014",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Nikhil Jain",
    email: "nikhil.jain21@college.edu",
    password: "student123",
    studentId: "CS21B015",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Megha Iyer",
    email: "megha.iyer21@college.edu",
    password: "student123",
    studentId: "CS21B016",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Saurabh Mishra",
    email: "saurabh.mishra21@college.edu",
    password: "student123",
    studentId: "CS21B017",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Ritika Chatterjee",
    email: "ritika.chatterjee21@college.edu",
    password: "student123",
    studentId: "CS21B018",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Harsh Agarwal",
    email: "harsh.agarwal21@college.edu",
    password: "student123",
    studentId: "CS21B019",
    department: "Computer Science",
    semester: 5
  },
  {
    name: "Tanvi Kulkarni",
    email: "tanvi.kulkarni21@college.edu",
    password: "student123",
    studentId: "CS21B020",
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