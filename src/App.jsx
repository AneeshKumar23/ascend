import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import PremiumPage from './pages/Premium';
import Navbar from './components/Navbar';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Show premium popup when user state changes
  useEffect(() => {
    if (user) {
      console.log('User logged in:', user);
      if (!sessionStorage.getItem('loginShown')) {
        console.log('Showing premium popup');
        setShowPremiumPopup(true);
        sessionStorage.setItem('loginShown', 'true');
      }
    } else {
      console.log('No user logged in');
    }
  }, [user]);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ProgressProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Premium Popup Overlay */}
            {showPremiumPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <PremiumPage onClose={() => setShowPremiumPopup(false)} />
              </div>
            )}

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                  <Navbar />
                </ProtectedRoute>
              } />
              <Route path="/habits" element={
                <ProtectedRoute>
                  <Habits />
                  <Navbar />
                </ProtectedRoute>
              } />
              <Route path="/goals" element={
                <ProtectedRoute>
                  <Goals />
                  <Navbar />
                </ProtectedRoute>
              } />
              <Route path="/achievements" element={
                <ProtectedRoute>
                  <Achievements />
                  <Navbar />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                  <Navbar />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </UserContext.Provider>
  );
}

export default App;