import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Lock, FileText, Building2 } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    citizenship_number: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userData = {
        ...formData,
        user_type: 'citizen'
      }

      await register(userData)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-[#F5F5F5]">
      <div className="py-20 px-6 md:px-12 lg:px-15">
        <div className="max-w-[700px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
              Create Your Account
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              Register to access Sarkaha services
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-[#FFEBEE] border-l-4 border-[#E74C3C] rounded">
                <p className="text-sm text-[#E74C3C]">{error}</p>
              </div>
            )}


            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="98XXXXXXXX"
                        className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                    />
                  </div>
                </div>

                {/* Citizenship Number */}
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                    Citizenship Number *
                  </label>
                  <div className="relative">
                    <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                    <input
                      type="text"
                      name="citizenship_number"
                      value={formData.citizenship_number}
                      onChange={handleChange}
                      required
                      placeholder="XX-XX-XX-XXXXX"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center bg-[#1E90FF] text-white text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide shadow-button transition-all duration-300 hover:bg-[#1873CC] hover:shadow-button-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#4A4A4A]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#1E90FF] font-medium hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

