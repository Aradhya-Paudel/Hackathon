import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import OfficialLogin from './pages/OfficialLogin'
import OfficialRegister from './pages/OfficialRegister'
import CitizenForm from './pages/CitizenForm'
import TrackApplication from './pages/TrackApplication'
import OfficialDashboard from './pages/OfficialDashboard'
import HierarchyDashboard from './pages/HierarchyDashboard'

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requireOfficial = false }) => {
  const { isAuthenticated, isOfficial, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto mb-4"></div>
          <p className="text-[#4A4A4A]">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireOfficial && !isOfficial) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/track" element={<TrackApplication />} />
        
        {/* Hidden Official Routes */}
        <Route path="/official/login" element={<OfficialLogin />} />
        <Route path="/official/register" element={<OfficialRegister />} />
        
        <Route
          path="/apply"
          element={
            <ProtectedRoute>
              <CitizenForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireOfficial={true}>
              <OfficialDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monitor"
          element={
            <ProtectedRoute requireOfficial={true}>
              <HierarchyDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App

