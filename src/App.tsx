import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHeader from './components/UserHeader';
import ProtectedRoute from './components/ProtectedRoute';
import SendParcel from './pages/SendParcel';
import TrackParcel from './pages/TrackParcel';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import Maps from './pages/Maps';
import DatabaseTest from './pages/DatabaseTest';
import DatabaseChecker from './pages/DatabaseChecker';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MedicalLogin from './pages/MedicalLogin';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/medical-login" element={<MedicalLogin />} />
              
              {/* Protected routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <UserHeader />
                    <main className="container mx-auto px-4 py-8">
                      <Routes>
                        <Route path="/" element={<UserDashboard />} />
                        <Route path="/send" element={<SendParcel />} />
                        <Route path="/track" element={<TrackParcel />} />
                        <Route path="/maps" element={<Maps />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/history" element={<OrderHistory />} />
                        <Route path="/database-test" element={<DatabaseTest />} />
                        <Route path="/database-checker" element={<DatabaseChecker />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;