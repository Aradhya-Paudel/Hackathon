import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, FileText, User, Phone, Mail, MapPin, Calendar, Building2 } from 'lucide-react'
import { applicationAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CitizenForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    province: '',
    district: '',
    city: '',
    ward: '',
    address: '',
    service_type: '',
    citizenship_number: user?.citizenship_number || '',
    description: '',
    target_office_level: '',
    target_office_name: ''
  })
  const [selectedWard, setSelectedWard] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showServiceSelection, setShowServiceSelection] = useState(false)

  // Nepal location data
  const provinces = [
    'Province 1',
    'Madhesh Province', 
    'Bagmati Province',
    'Gandaki Province',
    'Lumbini Province',
    'Karnali Province',
    'Sudurpashchim Province'
  ]

  const districtsByProvince = {
    'Province 1': [
      'Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 
      'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 
      'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'
    ],
    'Madhesh Province': [
      'Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 
      'Saptari', 'Sarlahi', 'Siraha'
    ],
    'Bagmati Province': [
      'Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 
      'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 
      'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'
    ],
    'Gandaki Province': [
      'Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 
      'Mustang', 'Myagdi', 'Nawalparasi East', 'Parbat', 
      'Syangja', 'Tanahun'
    ],
    'Lumbini Province': [
      'Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 
      'Kapilvastu', 'Nawalparasi West', 'Palpa', 'Parasi', 
      'Pyuthan', 'Rolpa', 'Rukum East'
    ],
    'Karnali Province': [
      'Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 
      'Kalikot', 'Mugu', 'Rukum West', 'Salyan', 'Surkhet'
    ],
    'Sudurpashchim Province': [
      'Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 
      'Darchula', 'Doti', 'Kailali', 'Kanchanpur'
    ]
  }

  const citiesByDistrict = {
    'Kaski': ['Pokhara Metropolitan City', 'Other cities/areas'],
    // All other districts show generic options
    'Bhojpur': ['Other cities/areas'],
    'Dhankuta': ['Other cities/areas'],
    'Ilam': ['Other cities/areas'],
    'Jhapa': ['Other cities/areas'],
    'Khotang': ['Other cities/areas'],
    'Morang': ['Other cities/areas'],
    'Okhaldhunga': ['Other cities/areas'],
    'Panchthar': ['Other cities/areas'],
    'Sankhuwasabha': ['Other cities/areas'],
    'Solukhumbu': ['Other cities/areas'],
    'Sunsari': ['Other cities/areas'],
    'Taplejung': ['Other cities/areas'],
    'Terhathum': ['Other cities/areas'],
    'Udayapur': ['Other cities/areas'],
    'Bara': ['Other cities/areas'],
    'Dhanusha': ['Other cities/areas'],
    'Mahottari': ['Other cities/areas'],
    'Parsa': ['Other cities/areas'],
    'Rautahat': ['Other cities/areas'],
    'Saptari': ['Other cities/areas'],
    'Sarlahi': ['Other cities/areas'],
    'Siraha': ['Other cities/areas'],
    'Bhaktapur': ['Other cities/areas'],
    'Chitwan': ['Other cities/areas'],
    'Dhading': ['Other cities/areas'],
    'Dolakha': ['Other cities/areas'],
    'Kathmandu': ['Other cities/areas'],
    'Kavrepalanchok': ['Other cities/areas'],
    'Lalitpur': ['Other cities/areas'],
    'Makwanpur': ['Other cities/areas'],
    'Nuwakot': ['Other cities/areas'],
    'Ramechhap': ['Other cities/areas'],
    'Rasuwa': ['Other cities/areas'],
    'Sindhuli': ['Other cities/areas'],
    'Sindhupalchok': ['Other cities/areas'],
    'Baglung': ['Other cities/areas'],
    'Gorkha': ['Other cities/areas'],
    'Lamjung': ['Other cities/areas'],
    'Manang': ['Other cities/areas'],
    'Mustang': ['Other cities/areas'],
    'Myagdi': ['Other cities/areas'],
    'Nawalparasi East': ['Other cities/areas'],
    'Parbat': ['Other cities/areas'],
    'Syangja': ['Other cities/areas'],
    'Tanahun': ['Other cities/areas'],
    'Arghakhanchi': ['Other cities/areas'],
    'Banke': ['Other cities/areas'],
    'Bardiya': ['Other cities/areas'],
    'Dang': ['Other cities/areas'],
    'Gulmi': ['Other cities/areas'],
    'Kapilvastu': ['Other cities/areas'],
    'Nawalparasi West': ['Other cities/areas'],
    'Palpa': ['Other cities/areas'],
    'Parasi': ['Other cities/areas'],
    'Pyuthan': ['Other cities/areas'],
    'Rolpa': ['Other cities/areas'],
    'Rukum East': ['Other cities/areas'],
    'Dailekh': ['Other cities/areas'],
    'Dolpa': ['Other cities/areas'],
    'Humla': ['Other cities/areas'],
    'Jajarkot': ['Other cities/areas'],
    'Jumla': ['Other cities/areas'],
    'Kalikot': ['Other cities/areas'],
    'Mugu': ['Other cities/areas'],
    'Rukum West': ['Other cities/areas'],
    'Salyan': ['Other cities/areas'],
    'Surkhet': ['Other cities/areas'],
    'Achham': ['Other cities/areas'],
    'Baitadi': ['Other cities/areas'],
    'Bajhang': ['Other cities/areas'],
    'Bajura': ['Other cities/areas'],
    'Dadeldhura': ['Other cities/areas'],
    'Darchula': ['Other cities/areas'],
    'Doti': ['Other cities/areas'],
    'Kailali': ['Other cities/areas'],
    'Kanchanpur': ['Other cities/areas']
  }

  // Pokhara Metropolitan wards (33 wards)
  const pokharaWards = Array.from({ length: 33 }, (_, i) => `Ward ${i + 1}`)

  // Service type to office mapping (Pokhara-specific)
  const serviceOfficeMap = {
    'house-registration': {
      level: 'district',
      name: 'Kaski District Land Revenue Office',
      description: 'Issues property ownership (lalpurja) and house/land registration',
      needsWard: false
    },
    'land-registration': {
      level: 'district',
      name: 'Kaski District Land Revenue Office',
      description: 'Handles land records, transfers and related services',
      needsWard: false
    },
    'national-id': {
      level: 'local',
      name: 'Pokhara Ward Office',
      description: 'National ID data collection and enrollment at ward level',
      needsWard: true
    },
    'passport': {
      level: 'district',
      name: 'Kaski DAO (Passport Section)',
      description: 'Passport applications processed through District Administration Office',
      needsWard: false
    },
    'drivers-license': {
      level: 'district',
      name: 'Kaski Transport Management Office',
      description: 'Driver\'s license issuance and biometric tests',
      needsWard: false
    },
    'birth-certificate': {
      level: 'local',
      name: 'Pokhara Ward Office',
      description: 'Birth event registration at ward level',
      needsWard: true
    },
    'marriage-certificate': {
      level: 'local',
      name: 'Pokhara Ward Office',
      description: 'Marriage registration (bihe darta) at ward level',
      needsWard: true
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Handle location changes
    if (name === 'province') {
      setFormData({
        ...formData,
        province: value,
        district: '',
        city: '',
        ward: '',
        service_type: '',
        target_office_level: '',
        target_office_name: ''
      })
      setShowServiceSelection(false)
      setError('')
    } else if (name === 'district') {
      setFormData({
        ...formData,
        district: value,
        city: '',
        ward: '',
        service_type: '',
        target_office_level: '',
        target_office_name: ''
      })
      setShowServiceSelection(false)
      setError('')
    } else if (name === 'city') {
      if (value === 'Pokhara Metropolitan City') {
        setFormData({
          ...formData,
          city: value,
          ward: '',
          service_type: '',
          target_office_level: '',
          target_office_name: ''
        })
        setShowServiceSelection(true)
        setError('')
      } else {
        setFormData({
          ...formData,
          city: value,
          ward: '',
          service_type: '',
          target_office_level: '',
          target_office_name: ''
        })
        setShowServiceSelection(false)
        setError('This service is currently only available in Pokhara Metropolitan City. Other areas are under development.')
      }
    } else if (name === 'service_type' && value) {
      const officeInfo = serviceOfficeMap[value]
      setFormData({
        ...formData,
        service_type: value,
        target_office_level: officeInfo.level,
        target_office_name: officeInfo.name
      })
      setSelectedWard('')
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
      setError('')
    }
  }

  const handleWardChange = (e) => {
    const ward = e.target.value
    setSelectedWard(ward)
    setFormData({
      ...formData,
      ward: ward
    })
    
    if (ward && formData.service_type) {
      const officeInfo = serviceOfficeMap[formData.service_type]
      setFormData({
        ...formData,
        ward: ward,
        target_office_name: `${ward} - ${officeInfo.name}`
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const application = await applicationAPI.create(formData)
      navigate(`/track?id=${application.id}`)
    } catch (err) {
      setError(err.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-[#F5F5F5]">
      <div className="py-20 px-6 md:px-12 lg:px-15">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
              Apply for Government Services
            </h1>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed">
              Fill out the form below to submit your application. You'll receive an instant ETA and tracking number.
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
                {/* Location Selection */}
                <div className="p-6 bg-[#E8F4FD] border-l-4 border-[#1E90FF] rounded">
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                    Select Your Location
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Province */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        Province *
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                        className="w-full bg-white border border-[#E0E0E0] rounded px-4 py-3 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select Province</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        District *
                      </label>
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        disabled={!formData.province}
                        className="w-full bg-white border border-[#E0E0E0] rounded px-4 py-3 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select District</option>
                        {formData.province && districtsByProvince[formData.province]?.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City/Municipality */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        City/Municipality *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        disabled={!formData.district}
                        className="w-full bg-white border border-[#E0E0E0] rounded px-4 py-3 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select City</option>
                        {formData.district && citiesByDistrict[formData.district]?.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Detailed Address */}
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        Street/Area *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Lakeside, Baidam"
                        className="w-full bg-white border border-[#E0E0E0] rounded px-4 py-3 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:outline-none placeholder:text-[#B8B8B8]"
                      />
                    </div>
                  </div>
                </div>

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

                {/* Service Type and Citizenship - Only show for Pokhara */}
                {showServiceSelection && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        Service Type *
                      </label>
                      <div className="relative">
                        <FileText size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
                        <select
                          name="service_type"
                          value={formData.service_type}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-12 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] appearance-none cursor-pointer"
                        >
                          <option value="">Select a service</option>
                          <option value="house-registration">House Registration (Lalpurja)</option>
                          <option value="land-registration">Land Registration</option>
                          <option value="national-id">National ID Card (NID)</option>
                          <option value="passport">Passport Application</option>
                          <option value="drivers-license">Driver's License</option>
                          <option value="birth-certificate">Birth Certificate</option>
                          <option value="marriage-certificate">Marriage Certificate</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                        Citizenship Number *
                      </label>
                      <div className="relative">
                        <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8B8B8]" />
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
                  </div>
                )}

                {/* Ward Selection for local services */}
                {formData.service_type && serviceOfficeMap[formData.service_type]?.needsWard && (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Select Your Ward *
                    </label>
                    <select
                      value={selectedWard}
                      onChange={handleWardChange}
                      required
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] appearance-none cursor-pointer"
                    >
                      <option value="">Select your ward in Pokhara</option>
                      {pokharaWards.map((ward) => (
                        <option key={ward} value={ward}>
                          {ward}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Auto-Assigned Office Info */}
                {formData.service_type && formData.target_office_name && (
                  <div className="p-6 bg-[#E8F4FD] border-l-4 border-[#1E90FF] rounded">
                    <div className="flex items-start gap-3">
                      <Building2 size={24} className="text-[#1E90FF] flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-[#2B2B2B] mb-2">
                          Your Application Will Be Processed At:
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#4A4A4A]">Office Level:</span>
                            <span className="text-sm font-semibold text-[#1E90FF] capitalize">
                              {formData.target_office_level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#4A4A4A]">Office Name:</span>
                            <span className="text-sm font-semibold text-[#2B2B2B]">
                              {formData.target_office_name}
                            </span>
                          </div>
                          <p className="text-xs text-[#4A4A4A] mt-2 italic">
                            {serviceOfficeMap[formData.service_type]?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description - Only show for Pokhara */}
                {showServiceSelection && (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                      Additional Information
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      placeholder="Any additional details you'd like to provide..."
                      className="w-full bg-[#F5F5F5] border border-[#E0E0E0] rounded px-4 py-3.5 text-base text-[#2B2B2B] transition-all duration-300 focus:border-[#1E90FF] focus:bg-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(30,144,255,0.1)] placeholder:text-[#B8B8B8] resize-none"
                    ></textarea>
                  </div>
                )}

                {/* Under Development Message for non-Pokhara */}
                {formData.city && formData.city !== 'Pokhara Metropolitan City' && (
                  <div className="p-8 bg-[#FFF4E5] border-l-4 border-[#FFA500] rounded text-center">
                    <h3 className="text-xl font-semibold text-[#2B2B2B] mb-3">
                      Service Under Development
                    </h3>
                    <p className="text-base text-[#4A4A4A] leading-relaxed">
                      This portal is currently only available for <strong>Pokhara Metropolitan City</strong>. 
                      We're working hard to expand services to other areas soon.
                    </p>
                    <p className="text-sm text-[#6B6B6B] mt-3">
                      Stay tuned for updates as we roll out to more regions across Nepal.
                    </p>
                  </div>
                )}

                {/* Submit Button - Only show for Pokhara */}
                {showServiceSelection && (
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center bg-[#1E90FF] text-white text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide shadow-button transition-all duration-300 hover:bg-[#1873CC] hover:shadow-button-hover hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                      <Send size={18} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Info Note */}
            <div className="mt-8 p-4 bg-[#E8F4FD] rounded border-l-4 border-[#1E90FF]">
              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                <strong className="text-[#2B2B2B]">Note:</strong> After submitting your application, 
                you will receive a unique tracking ID and estimated completion time. You can use this ID 
                to track your application status in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitizenForm

