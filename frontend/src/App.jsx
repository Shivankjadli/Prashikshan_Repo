import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Landing Page
import LandingPage from './pages/LandingPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentJobs from './pages/student/StudentJobs';
import StudentApplications from './pages/student/StudentApplications';
import StudentQuizzes from './pages/student/StudentQuizzes';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentOffers from './pages/student/StudentOffers';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants';
import RecruiterQuizzes from './pages/recruiter/RecruiterQuizzes';
import RecruiterAssignments from './pages/recruiter/RecruiterAssignments';
import RecruiterOffers from './pages/recruiter/RecruiterOffers';
import RecruiterAnalytics from './pages/recruiter/RecruiterAnalytics';

// College Pages
import CollegeDashboard from './pages/college/CollegeDashboard';
import CollegeStudents from './pages/college/CollegeStudents';
import CollegeJobs from './pages/college/CollegeJobs';
import CollegeQuizzes from './pages/college/CollegeQuizzes';
import CollegeAssignments from './pages/college/CollegeAssignments';
import CollegeAnalytics from './pages/college/CollegeAnalytics';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ style: { background: '#ffffff', color: '#0f172a', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', borderRadius: '12px', fontFamily: "'Inter', 'Poppins', sans-serif" } }} />
      <BrowserRouter>
        <Routes>
          {/* Public / Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="Student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="Student"><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/jobs" element={<ProtectedRoute role="Student"><StudentJobs /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute role="Student"><StudentApplications /></ProtectedRoute>} />
          <Route path="/student/quizzes" element={<ProtectedRoute role="Student"><StudentQuizzes /></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute role="Student"><StudentAssignments /></ProtectedRoute>} />
          <Route path="/student/offers" element={<ProtectedRoute role="Student"><StudentOffers /></ProtectedRoute>} />

          {/* Recruiter Routes */}
          <Route path="/recruiter" element={<ProtectedRoute role="Recruiter"><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/recruiter/jobs" element={<ProtectedRoute role="Recruiter"><RecruiterJobs /></ProtectedRoute>} />
          <Route path="/recruiter/applicants" element={<ProtectedRoute role="Recruiter"><RecruiterApplicants /></ProtectedRoute>} />
          <Route path="/recruiter/quizzes" element={<ProtectedRoute role="Recruiter"><RecruiterQuizzes /></ProtectedRoute>} />
          <Route path="/recruiter/assignments" element={<ProtectedRoute role="Recruiter"><RecruiterAssignments /></ProtectedRoute>} />
          <Route path="/recruiter/offers" element={<ProtectedRoute role="Recruiter"><RecruiterOffers /></ProtectedRoute>} />
          <Route path="/recruiter/analytics" element={<ProtectedRoute role="Recruiter"><RecruiterAnalytics /></ProtectedRoute>} />

          {/* College Routes */}
          <Route path="/college" element={<ProtectedRoute role="College"><CollegeDashboard /></ProtectedRoute>} />
          <Route path="/college/students" element={<ProtectedRoute role="College"><CollegeStudents /></ProtectedRoute>} />
          <Route path="/college/jobs" element={<ProtectedRoute role="College"><CollegeJobs /></ProtectedRoute>} />
          <Route path="/college/quizzes" element={<ProtectedRoute role="College"><CollegeQuizzes /></ProtectedRoute>} />
          <Route path="/college/assignments" element={<ProtectedRoute role="College"><CollegeAssignments /></ProtectedRoute>} />
          <Route path="/college/analytics" element={<ProtectedRoute role="College"><CollegeAnalytics /></ProtectedRoute>} />

          {/* Fallbacks */}
          <Route path="/unauthorized" element={<div className="empty-state"><h3>403 Unauthorized</h3></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
