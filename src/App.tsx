import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MedicalLogin from './pages/MedicalLogin';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Component to handle authenticated vs unauthenticated routing
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading AeroVita...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - only accessible when NOT authenticated */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Homepage />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" replace /> : <Signup />} 
      />
      <Route 
        path="/medical-login" 
        element={user ? <Navigate to="/dashboard" replace /> : <MedicalLogin />} 
      />
      
      {/* Protected routes - only accessible when authenticated */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <UserDashboard />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/send" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <SendParcel />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/track" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <TrackParcel />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/maps" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <Maps />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <Profile />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/history" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <OrderHistory />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/database-test" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <DatabaseTest />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/database-checker" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <UserHeader />
            <main className="container mx-auto px-4 py-8">
              <DatabaseChecker />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to appropriate page */}
      <Route 
        path="*" 
        element={<Navigate to={user ? "/dashboard" : "/"} replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <Router>
            <AppRoutes />
          </Router>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;