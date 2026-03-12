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

const API_BASE_URL = 'http://localhost:8000';

export async function predictStudentDropout(data: StudentData): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
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
