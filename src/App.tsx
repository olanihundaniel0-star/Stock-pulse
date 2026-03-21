import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import ProtectedRoute from './src/components/ProtectedRoute';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';

// Import your existing dashboard/app pages here
// import Dashboard from './components/Dashboard';
// import Inventory from './components/Inventory';
// etc.

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {/* <Dashboard /> */}
                <div className="min-h-screen bg-gray-50 p-8">
                  <h1>Dashboard (Coming Soon)</h1>
                  <p>Replace this with your Dashboard component</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard if authenticated, else to signin */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
