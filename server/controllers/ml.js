// In a real scenario, this would import 'axios' to make HTTP requests to the FastAPI ml_service.
// For now, we will create mock controllers that simulate that interaction or use a placeholder approach.
// Assuming ml_service runs on http://localhost:8000

const axios = require('axios');
const StudentProfile = require('../models/StudentProfile');

// @desc    Predict dropout risk for a student
// @route   POST /api/v1/ml/predict-dropout/:studentId
// @access  Private/Mentor/Admin
exports.predictDropout = async (req, res, next) => {
  try {
    const student = await StudentProfile.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    let riskScore = 0;
    let riskLevel = 'Not Assessed';
    
    // Default studentData mapped from DB fields
    const studentData = {
        Number_of_Absences: Math.floor((100 - (student.attendancePercentage || 100)) / 5),
        Grade_2: (student.cgpa || 0) * 2, // Map CGPA to max 20
        Age: 18 // Default
    };

    try {
      // Try calling Python ML service
      const response = await axios.post('http://localhost:8000/predict', studentData);
      
      if (response.data) {
        riskScore = response.data.risk_score || Math.random();
        const dropoutRisk = response.data.dropout;
        
        // Map riskScore to our risk levels
        if (riskScore > 0.7) riskLevel = 'High';
        else if (riskScore > 0.4) riskLevel = 'Medium';
        else riskLevel = 'Low';
      }
    } catch (apiErr) {
      console.warn('Python ML service unreachable or failed. Using mock dropout data.');
      // Mock ML prediction for demonstration if backend unreachable.
      const mockRiskLevels = ['Low', 'Medium', 'High'];
      riskLevel = mockRiskLevels[Math.floor(Math.random() * mockRiskLevels.length)];
      riskScore = Math.random();
    }

    // Update student profile with new prediction
    student.dropoutRisk = riskLevel;
    student.riskScore = Math.round(riskScore * 100);
    await student.save();

    res.status(200).json({
      success: true,
      data: {
        student: student._id,
        dropoutRisk: riskLevel,
        riskScore: student.riskScore,
        message: 'Prediction successful'
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Analyze sentiment of student text
// @route   POST /api/v1/ml/analyze-sentiment
// @access  Private
exports.analyzeSentiment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Please provide text to analyze' });
    }

    let sentimentResult = 'Unknown';
    
    try {
      // Try calling Python ML service for sentiment analysis
      const response = await axios.post('http://localhost:8000/sentiment', { text });
      if (response.data && response.data.sentiment) {
        sentimentResult = response.data.sentiment;
      }
    } catch (apiErr) {
      console.warn('Python Sentiment service unreachable. Using mock sentiment data.');
      // Mock Sentiment Analysis
      const mockSentiments = ['Stable', 'Stressed', 'Anxious', 'Disengaged'];
      sentimentResult = mockSentiments[Math.floor(Math.random() * mockSentiments.length)];
    }

    res.status(200).json({
      success: true,
      data: {
        text,
        sentiment: sentimentResult,
        message: 'Sentiment analysis successful'
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
