import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Lock, Building2, Shield } from 'lucide-react'

const OfficialRegister = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    office_level: '',
    office_name: ''
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
        user_type: 'official'
      }

      await register(userData)
      navigate('/dashboard')
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
            <div className="w-16 h-16 bg-[#1E90FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} color="#FFFFFF" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
              Official Registration
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              Register as a Government Official
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
                      Official Email *
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="official@gov.np"
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

                {/* Office Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Office Level *
                    </label>
                    <select
                      name="office_level"
                      value={formData.office_level}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)]"
                    >
                      <option value="">Select level</option>
                      <option value="local">Local (Ward Office)</option>
                      <option value="district">District (Land Revenue, Transport Office)</option>
                      <option value="metropolitan">Metropolitan</option>
                      <option value="province">Province</option>
                      <option value="national">National (Passport, Central Offices)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Office Name *
                    </label>
                    <input
                      type="text"
                      name="office_name"
                      value={formData.office_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Ward Office (Marriage Registration)"
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8]"
                    />
                  </div>
                </div>

                {/* Office Registration Guide - Pokhara Specific */}
                <div className="p-4 bg-[#FFF3E0] border-l-4 border-[#F39C12] rounded">
                  <p className="text-sm text-[#2B2B2B] mb-3">
                    <strong>Pokhara Metropolitan City - Government Offices:</strong>
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-[#2B2B2B] mb-1">Local Level (33 Ward Offices):</p>
                      <ul className="text-xs text-[#4A4A4A] space-y-1 ml-4">
                        <li>• <strong>Format:</strong> Ward 1 - Pokhara Ward Office (Marriage Registration)</li>
                        <li>• <strong>Format:</strong> Ward 15 - Pokhara Ward Office (Birth Registration)</li>
                        <li>• <strong>Format:</strong> Ward 33 - Pokhara Ward Office (NID Enrollment)</li>
                        <li className="text-[#E65100] italic">Replace "Ward X" with your actual ward number (1-33)</li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#2B2B2B] mb-1">District Level (Kaski):</p>
                      <ul className="text-xs text-[#4A4A4A] space-y-1 ml-4">
                        <li>• <strong>Kaski District Land Revenue Office</strong> (House/Land Registration)</li>
                        <li>• <strong>Kaski Transport Management Office</strong> (Driver's License)</li>
                        <li>• <strong>Kaski DAO (Passport Section)</strong> (Passport Processing)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-xs text-[#E65100] mt-3 font-semibold">
                    ⚠️ Office name must match EXACTLY to receive applications!
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center bg-[#1E90FF] text-white text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide shadow-button transition-all duration-300 hover:bg-[#1873CC] hover:shadow-button-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Register as Official'}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#4A4A4A]">
                Already have an account?{' '}
                <Link to="/official/login" className="text-[#1E90FF] font-medium hover:underline">
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

export default OfficialRegister

