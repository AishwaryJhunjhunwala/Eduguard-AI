export interface StudentData {
    School: string;
    Gender: string;
    Age: number;
    Address: string;
    Family_Size: string;
    Parental_Status: string;
    Mother_Education: number;
    Father_Education: number;
    Mother_Job: string;
    Father_Job: string;
    Reason_for_Choosing_School: string;
    Guardian: string;
    Travel_Time: number;
    Study_Time: number;
    Number_of_Failures: number;
    School_Support: string;
    Family_Support: string;
    Extra_Paid_Class: string;
    Extra_Curricular_Activities: string;
    Attended_Nursery: string;
    Wants_Higher_Education: string;
    Internet_Access: string;
    In_Relationship: string;
    Family_Relationship: number;
    Free_Time: number;
    Going_Out: number;
    Weekend_Alcohol_Consumption: number;
    Weekday_Alcohol_Consumption: number;
    Health_Status: number;
    Number_of_Absences: number;
    Grade_1: number;
    Grade_2: number;
}

export interface PredictionResponse {
    dropout: boolean;
    risk_score: number;
}

const API_BASE_URL = 'http://localhost:5000/api';
const ML_API_BASE_URL = 'http://localhost:8000';

export async function predictStudentDropout(data: StudentData): Promise<PredictionResponse> {
    const response = await fetch(`${ML_API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to get prediction');
    }

    return await response.json();
}

// Ensure the token is passed in headers
const getAuthHeaders = () => {
    // You can pull this from your auth state/localStorage if you add JWT logic later.
    // Assuming localStorage for Demo purposes
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export async function getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return await response.json();
}

export async function getStudents() {
    const response = await fetch(`${API_BASE_URL}/v1/students`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return await response.json();
}

export async function getStudent(id: string) {
    const response = await fetch(`${API_BASE_URL}/v1/students/${id}`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch student profile');
    return await response.json();
}

export async function getRecentAttendance() {
    const response = await fetch(`${API_BASE_URL}/v1/attendance/recent`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch recent attendance');
    return await response.json();
}

export async function addStudent(data: any) {
    const response = await fetch(`${API_BASE_URL}/v1/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add student');
    return await response.json();
}

export async function loginUser(credentials: any) {
    const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }
    return await response.json();
}

export async function getMe() {
    const response = await fetch(`${API_BASE_URL}/v1/auth/me`, {
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return await response.json();
}
