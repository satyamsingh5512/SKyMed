import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHeader from './components/UserHeader';
import SendParcel from './pages/SendParcel';
import TrackParcel from './pages/TrackParcel';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
          <UserHeader />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<UserDashboard />} />
              <Route path="/send" element={<SendParcel />} />
              <Route path="/track" element={<TrackParcel />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;