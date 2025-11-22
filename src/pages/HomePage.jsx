import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, FileCheck, TrendingUp, CheckCircle } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center justify-center text-center px-6 md:px-12 lg:px-15 py-24 md:py-28"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[900px] mx-auto">
          <h1 
            className="text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight mb-6"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
          >
            Transparent Governance Through Digital Accountability
          </h1>
          <p 
            className="text-lg md:text-xl lg:text-[18px] font-normal text-white leading-relaxed mb-10"
            style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}
          >
            Track your applications in real-time, monitor government efficiency, and ensure timely 
            delivery of public services. A revolutionary system for Nepal's digital governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/apply"
              className="inline-flex items-center justify-center bg-[#1E90FF] text-white text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide shadow-button transition-all duration-300 hover:bg-[#1873CC] hover:shadow-button-hover hover:-translate-y-0.5"
            >
              Apply Now
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              to="/track"
              className="inline-flex items-center justify-center bg-white text-[#2B2B2B] text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide border-2 border-white shadow-md transition-all duration-300 hover:bg-[rgba(255,255,255,0.9)] hover:shadow-lg hover:-translate-y-0.5"
            >
              Track Application
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        className="py-20 px-6 md:px-12 lg:px-15"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Stat 1 */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-[100px] md:h-[100px] rounded-full border-3 border-white bg-transparent flex items-center justify-center flex-shrink-0">
                <Users size={48} color="#FFFFFF" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg md:text-[18px] font-medium text-white leading-snug">
                  Applications Processed
                </p>
                <p className="text-4xl md:text-[42px] font-bold text-white leading-tight">
                  50,000+
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-[100px] md:h-[100px] rounded-full border-3 border-white bg-transparent flex items-center justify-center flex-shrink-0">
                <FileCheck size={48} color="#FFFFFF" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg md:text-[18px] font-medium text-white leading-snug">
                  Average Processing Time
                </p>
                <p className="text-4xl md:text-[42px] font-bold text-white leading-tight">
                  3 Days
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-[100px] md:h-[100px] rounded-full border-3 border-white bg-transparent flex items-center justify-center flex-shrink-0">
                <TrendingUp size={48} color="#FFFFFF" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg md:text-[18px] font-medium text-white leading-snug">
                  Efficiency Improvement
                </p>
                <p className="text-4xl md:text-[42px] font-bold text-white leading-tight">
                  85%
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 lg:px-15 bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-3">
              How It Works
            </h2>
            <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mx-auto mb-6"></div>
            <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-[800px] mx-auto">
              A comprehensive system designed to bring transparency and efficiency to government services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - For Citizens */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-[#E8F4FD] flex items-center justify-center mb-5">
                  <FileCheck size={28} color="#1E90FF" strokeWidth={2} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#2B2B2B] mb-3">
                  For Citizens
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Submit applications online for various government services
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Get instant ETA and processing flowchart
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Track your application in real-time
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Report delays and hold officials accountable
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 - For Officials */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-[#E8F4FD] flex items-center justify-center mb-5">
                  <TrendingUp size={28} color="#1E90FF" strokeWidth={2} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#2B2B2B] mb-3">
                  For Officials
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Monitor applications and track productivity
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      View real-time analytics and performance metrics
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Communicate with higher authorities
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Access hierarchical chain of command
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 - Smart System */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="p-6">
                <div className="w-16 h-16 rounded-full bg-[#E8F4FD] flex items-center justify-center mb-5">
                  <Users size={28} color="#1E90FF" strokeWidth={2} />
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#2B2B2B] mb-3">
                  Smart Analytics
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      AI-powered ETA predictions using ML models
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Automatic data collection and model training
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Performance tracking across all levels
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#1E90FF] flex-shrink-0 mt-0.5" />
                    <span className="text-base text-[#4A4A4A] leading-relaxed">
                      Continuous improvement through data insights
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-15 bg-white">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-[36px] font-semibold text-[#2B2B2B] mb-4">
            Ready to Experience Transparent Governance?
          </h2>
          <div className="w-16 h-1 bg-[#1E90FF] rounded-sm mx-auto mb-6"></div>
          <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-[700px] mx-auto mb-10">
            Join thousands of citizens already using Sarkaha to track their government applications
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center justify-center bg-[#1E90FF] text-white text-base font-semibold px-8 py-3.5 rounded uppercase tracking-wide shadow-button transition-all duration-300 hover:bg-[#1873CC] hover:shadow-button-hover hover:-translate-y-0.5"
          >
            Get Started Now
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

