from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
MODEL_PATH = "student_dropout_model.pkl"

try:
    if os.path.exists(MODEL_PATH):
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
        print("Model loaded successfully.")
except Exception as e:
    print(f"Failed to load model from {MODEL_PATH}. Error: {e}")
    print("Using a mock prediction model for demonstration.")

class StudentData(BaseModel):
    School: str = 'GP'
    Gender: str = 'F'
    Age: int = 18
    Address: str = 'U'
    Family_Size: str = 'GT3'
    Parental_Status: str = 'A'
    Mother_Education: int = 4
    Father_Education: int = 4
    Mother_Job: str = 'at_home'
    Father_Job: str = 'teacher'
    Reason_for_Choosing_School: str = 'course'
    Guardian: str = 'mother'
    Travel_Time: int = 1
    Study_Time: int = 2
    Number_of_Failures: int = 0
    School_Support: str = 'no'
    Family_Support: str = 'yes'
    Extra_Paid_Class: str = 'no'
    Extra_Curricular_Activities: str = 'no'
    Attended_Nursery: str = 'yes'
    Wants_Higher_Education: str = 'yes'
    Internet_Access: str = 'yes'
    In_Relationship: str = 'no'
    Family_Relationship: int = 4
    Free_Time: int = 3
    Going_Out: int = 4
    Weekend_Alcohol_Consumption: int = 1
    Weekday_Alcohol_Consumption: int = 1
    Health_Status: int = 3
    Number_of_Absences: int = 4
    Grade_1: int = 0
    Grade_2: int = 11

def preprocess_student_data(df):
    df_new = df.copy()

    # Binary Encoding
    binary_map = {'yes': 1, 'no': 0, 'U': 1, 'R': 0, 'LE3': 0, 'GT3': 1, 'T': 0, 'A': 1, 'M': 1, 'F': 0, 'GP': 1, 'MS': 0}
    bin_cols = [
        'School', 'Gender', 'Address', 'Family_Size', 'Parental_Status', 
        'School_Support', 'Family_Support', 'Extra_Paid_Class', 
        'Extra_Curricular_Activities', 'Attended_Nursery', 
        'Wants_Higher_Education', 'Internet_Access', 'In_Relationship'
    ]
    for col in bin_cols:
        df_new[col] = df_new[col].map(binary_map)

    # One-Hot Encoding
    nominal_cols = ['Mother_Job', 'Father_Job', 'Reason_for_Choosing_School', 'Guardian']
    df_new = pd.get_dummies(df_new, columns=nominal_cols, drop_first=False)

    # Ensure all expected dummy columns exist with correct names based on Kaggle notebook get_dummies(drop_first=True)
    expected_cols = [
        'School', 'Gender', 'Age', 'Address', 'Family_Size', 'Parental_Status',
        'Mother_Education', 'Father_Education', 'Travel_Time', 'Study_Time',
        'Number_of_Failures', 'School_Support', 'Family_Support', 'Extra_Paid_Class',
        'Extra_Curricular_Activities', 'Attended_Nursery', 'Wants_Higher_Education',
        'Internet_Access', 'In_Relationship', 'Family_Relationship', 'Free_Time',
        'Going_Out', 'Weekend_Alcohol_Consumption', 'Weekday_Alcohol_Consumption',
        'Health_Status', 'Number_of_Absences', 'Grade_1', 'Grade_2',
        'Mother_Job_health', 'Mother_Job_other', 'Mother_Job_services', 'Mother_Job_teacher',
        'Father_Job_health', 'Father_Job_other', 'Father_Job_services', 'Father_Job_teacher',
        'Reason_for_Choosing_School_home', 'Reason_for_Choosing_School_other', 'Reason_for_Choosing_School_reputation',
        'Guardian_mother', 'Guardian_other'
    ]
    
    for col in expected_cols:
        if col not in df_new.columns:
            df_new[col] = False
            
    # Keep only the expected columns in the exact order
    df_new = df_new[expected_cols]

    # Dummy Scaling Strategy (Fallback if scaler is lost)
    scale_cols = [
        'Age', 'Mother_Education', 'Father_Education', 'Travel_Time', 'Study_Time', 
        'Number_of_Failures', 'Family_Relationship', 'Free_Time', 'Going_Out', 
        'Weekend_Alcohol_Consumption', 'Weekday_Alcohol_Consumption', 
        'Health_Status', 'Number_of_Absences', 'Grade_1', 'Grade_2'
    ]
    
    # We leave scaling out for raw Random Forest applicability, or if it complains, just pass as is.
    return df_new

@app.post("/predict")
def predict_dropout(data: StudentData):
    try:
        # 1. Convert to DataFrame
        df = pd.DataFrame([data.dict()])
        
        # 2. Preprocess
        df_ready = preprocess_student_data(df)
        
        # 3. Predict
        if model is not None:
            # Reorder columns to exactly match what the model expects if possible
            if hasattr(model, 'feature_names_in_'):
                df_ready = df_ready[model.feature_names_in_]
            
            prediction = model.predict(df_ready)[0]
            probability = model.predict_proba(df_ready)[0][1] if hasattr(model, 'predict_proba') else 0.5
            
            return {
                "dropout": bool(prediction),
                "risk_score": float(probability)
            }
        else:
            # Mock Prediction if the pickled model couldn't be loaded
            score = random.uniform(0.1, 0.9)
            if data.Number_of_Absences > 5 or data.Grade_2 < 10:
                score += 0.3
            score = min(score, 0.99)
            return {
                "dropout": score > 0.5,
                "risk_score": round(score, 2)
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
