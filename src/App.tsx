import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HomePage from './components/HomePage';
import Dashboard from './components/common/Dashboard';
import RosterCreate from './components/roster/RosterCreate';
import RosterDisplay from './components/roster/RosterDisplay';
import ProtectedRoute from './components/common/ProtectedRoute';
// @ts-ignore-next-line
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/create-roster" element={
              <ProtectedRoute>
                <RosterCreate />
              </ProtectedRoute>
            } />
            
            <Route path="/roster/:id" element={
              <ProtectedRoute>
                <RosterDisplay />
              </ProtectedRoute>
            } />

            <Route path="/roster/print" element={
              <ProtectedRoute>
                <RosterDisplay />
              </ProtectedRoute>
            } />

            {/* 
            <Route path="/roster/:id/snapshot/:snapshotId" element={
              <ProtectedRoute>
                <RosterDisplay />
              </ProtectedRoute>
            } />
            <Route path="/roster/:id/snapshot/:snapshotId/compare/:compareSnapshotId" element={
              <ProtectedRoute>
                <RosterDisplay />
              </ProtectedRoute>
            } /> */}
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;