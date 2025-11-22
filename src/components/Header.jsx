import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        isScrolled ? 'shadow-lg' : 'shadow-md'
      }`}
      style={{ backgroundColor: '#2B2B2B' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-15 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Building2 size={40} color="#FFFFFF" />
          <div className="flex flex-col">
            <span className="text-white text-2xl md:text-[28px] font-bold leading-tight">
              Sarkaha
            </span>
            <span 
              className="text-[#B8B8B8] text-[10px] md:text-xs font-normal uppercase tracking-[2px]"
            >
              Government Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-base font-medium transition-colors duration-300 ${
              isActive('/') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
            }`}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              to="/apply"
              className={`text-base font-medium transition-colors duration-300 ${
                isActive('/apply') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
              }`}
            >
              Apply for Services
            </Link>
          )}
          <Link
            to="/track"
            className={`text-base font-medium transition-colors duration-300 ${
              isActive('/track') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
            }`}
          >
            Track Application
          </Link>
          {isAuthenticated && user?.user_type === 'official' && !user?.is_monitor && (
            <Link
              to="/dashboard"
              className={`text-base font-medium transition-colors duration-300 ${
                isActive('/dashboard') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
              }`}
            >
              Official Portal
            </Link>
          )}
          {isAuthenticated && user?.is_monitor && (
            <Link
              to="/monitor"
              className={`text-base font-medium transition-colors duration-300 ${
                isActive('/monitor') ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
              }`}
            >
              Monitor Dashboard
            </Link>
          )}
          
          {/* Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#4A4A4A]">
              <span className="text-white text-sm flex items-center gap-2">
                <User size={16} />
                {user?.full_name}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-white text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#4A4A4A]">
              <Link
                to="/login"
                className="text-white text-sm font-medium hover:text-[#D4AF37] transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#1E90FF] text-white text-sm font-semibold px-4 py-2 rounded transition-all duration-300 hover:bg-[#1873CC]"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2B2B2B] border-t border-[#3A3A3A]">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium transition-colors duration-300 py-2 ${
                isActive('/') ? 'text-[#D4AF37]' : 'text-white'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/apply"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors duration-300 py-2 ${
                  isActive('/apply') ? 'text-[#D4AF37]' : 'text-white'
                }`}
              >
                Apply for Services
              </Link>
            )}
            <Link
              to="/track"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium transition-colors duration-300 py-2 ${
                isActive('/track') ? 'text-[#D4AF37]' : 'text-white'
              }`}
            >
              Track Application
            </Link>
            {isAuthenticated && user?.user_type === 'official' && !user?.is_monitor && (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors duration-300 py-2 ${
                  isActive('/dashboard') ? 'text-[#D4AF37]' : 'text-white'
                }`}
              >
                Official Portal
              </Link>
            )}
            {isAuthenticated && user?.is_monitor && (
              <Link
                to="/monitor"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium transition-colors duration-300 py-2 ${
                  isActive('/monitor') ? 'text-[#D4AF37]' : 'text-white'
                }`}
              >
                Monitor Dashboard
              </Link>
            )}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-[#3A3A3A] space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-white text-sm py-2">
                    Logged in as: <span className="font-semibold">{user?.full_name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      logout()
                    }}
                    className="w-full text-left text-white text-base font-medium py-2 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white text-base font-medium py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block bg-[#1E90FF] text-white text-sm font-semibold px-4 py-2 rounded text-center"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

