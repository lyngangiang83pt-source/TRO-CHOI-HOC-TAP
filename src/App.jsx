import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Navbar } from './components/common/Navbar';
import { StudentDashboard } from './pages/StudentDashboard';
import { GamePlayPage } from './pages/GamePlayPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

// Component phân quyền nghiêm ngặt: Chỉ duy nhất user "lyngangiang83pt@gmail.com" hoặc username "lyngangiang83pt" mới được truy cập Admin
const RequireAdmin = ({ children }) => {
  const { profile, user } = useAuth();
  const isAdmin = 
    profile?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com' ||
    profile?.username?.toLowerCase() === 'lyngangiang83pt' ||
    user?.email?.toLowerCase() === 'lyngangiang83pt@gmail.com';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF4E8] dark:bg-[#0C0F17] text-[#1C1917] dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/play/:gameId" element={<GamePlayPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
