import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import VideoConsult from './pages/VideoConsult';
import AdminPanel from './pages/AdminPanel';
import BookAppointment from './pages/BookAppointment';
import MedicalHistory from './pages/MedicalHistory';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/symptom-checker" 
              element={
                <ProtectedRoute>
                  <SymptomChecker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/video-consult/:appointmentId?" 
              element={
                <ProtectedRoute>
                  <VideoConsult />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book-appointment" 
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/medical-history" 
              element={
                <ProtectedRoute>
                  <MedicalHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;