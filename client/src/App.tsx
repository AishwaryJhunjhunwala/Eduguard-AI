import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { Attendance } from './pages/Attendance';
import { RiskMonitoring } from './pages/RiskMonitoring';
import { StudentsDirectory } from './pages/StudentsDirectory';
import { StudentProfile } from './pages/StudentProfile';
import { Profile } from './pages/Profile';
import { ClassCheckIn } from './pages/ClassCheckIn';
import { AuthProvider, useAuth } from './store/AuthContext';

// Mock routing based on selected role
const RoleBasedDashboard = () => {
  const { role } = useAuth();

  if (role === 'admin' || role === 'counselor') return <AdminDashboard />;
  if (role === 'mentor') return <FacultyDashboard />;
  if (role === 'student') return <StudentDashboard />;
  return <AdminDashboard />;
};

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<RoleBasedDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/check-in" element={<ClassCheckIn />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/risk-monitoring" element={<RiskMonitoring />} />
              <Route path="/students" element={<StudentsDirectory />} />
              <Route path="/students/:id" element={<StudentProfile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
