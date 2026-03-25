export type Role = 'admin' | 'mentor' | 'counselor' | 'student';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
}

export interface Student {
    id: string;
    studentId: string;
    name: string;
    email: string;
    major: string;
    year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    status: 'Active' | 'Inactive' | 'Graduated';
    gpa: number;
    attendanceOverall: number;
    riskScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
}

export interface AttendanceRecord {
    id: string;
    date: string;
    courseId: string;
    courseName: string;
    studentId: string;
    studentName: string;
    status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export interface Course {
    id: string;
    code: string;
    name: string;
    instructorId: string;
    credits: number;
    enrolledStudents: number;
    averageAttendance: number;
    averageScore: number;
}

export interface SubjectProgress {
    subject: string;
    progress: number;
}

export interface AttendanceData {
    name: string;
    score: number;
}
