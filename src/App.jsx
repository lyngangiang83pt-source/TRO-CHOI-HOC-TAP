import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { StudentDashboard } from './pages/StudentDashboard';
import { GamePlayPage } from './pages/GamePlayPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-main)] transition-colors duration-300">
            <Navbar />
            <main className="flex-1 pb-12">
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="/play/:gameId" element={<GamePlayPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/auth" element={<AuthPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
