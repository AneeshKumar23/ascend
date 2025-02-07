import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProgressProvider } from "./context/ProgressContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Goals from "./pages/Goals";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import ProgressPopup from "./components/ProgressPopup";

// Create context for global state
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    return children;
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ProgressProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 text-gray-100">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <>
                      <Dashboard />
                      <Navbar />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/habits"
                element={
                  <ProtectedRoute>
                    <>
                      <Habits />
                      <Navbar />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <>
                      <Goals />
                      <Navbar />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <>
                      <Achievements />
                      <Navbar />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <>
                      <Profile />
                      <Navbar />
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ProgressProvider>
    </UserContext.Provider>
  );
}

export default App;
