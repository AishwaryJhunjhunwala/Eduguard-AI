const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    name: "Admin One",
    email: "admin1@eduguard.com",
    password: "admin123",
    role: "Admin"
  },
  {
    name: "Admin Two",
    email: "admin2@eduguard.com",
    password: "admin123",
    role: "Admin"
  },
  {
    name: "Mentor One",
    email: "mentor1@eduguard.com",
    password: "mentor123",
    role: "Mentor"
  },
  {
    name: "Counselor One",
    email: "counselor1@eduguard.com",
    password: "counselor123",
    role: "Counselor"
  },
  {
    name: "Student One",
    email: "student1@eduguard.com",
    password: "student123",
    role: "Student"
  },
  {
    name: "Student Two",
    email: "student2@eduguard.com",
    password: "student123",
    role: "Student"
  }
];

const importData = async () => {
  try {
    await User.deleteMany();

    await User.create(users);

    console.log("Users inserted");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();