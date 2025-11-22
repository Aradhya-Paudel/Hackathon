import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#2B2B2B] text-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-15 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10">
          {/* About Section */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-2">About Sarkaha</h4>
            <div className="w-10 h-[3px] bg-[#1E90FF] rounded-sm mb-5"></div>
            <p className="text-sm text-[#B8B8B8] leading-relaxed mb-4">
              A comprehensive government monitoring and accountability system designed to track 
              official progress and ensure timely delivery of public services across Nepal.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center transition-all duration-300 hover:bg-[#1E90FF] hover:-translate-y-0.5"
              >
                <Facebook size={18} color="#FFFFFF" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center transition-all duration-300 hover:bg-[#1E90FF] hover:-translate-y-0.5"
              >
                <Twitter size={18} color="#FFFFFF" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center transition-all duration-300 hover:bg-[#1E90FF] hover:-translate-y-0.5"
              >
                <Linkedin size={18} color="#FFFFFF" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center transition-all duration-300 hover:bg-[#1E90FF] hover:-translate-y-0.5"
              >
                <Youtube size={18} color="#FFFFFF" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-2">Quick Links</h4>
            <div className="w-10 h-[3px] bg-[#1E90FF] rounded-sm mb-5"></div>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                Home
              </Link>
              <Link
                to="/apply"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                Apply for Services
              </Link>
              <Link
                to="/track"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                Track Application
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                Official Portal
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-2">Services</h4>
            <div className="w-10 h-[3px] bg-[#1E90FF] rounded-sm mb-5"></div>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                House Registration
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                National ID Card
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                Passport Application
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-[#B8B8B8] hover:text-white transition-colors duration-300"
              >
                <span className="text-[#B8B8B8]">›</span>
                Driver License
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-2">Contact Us</h4>
            <div className="w-10 h-[3px] bg-[#1E90FF] rounded-sm mb-5"></div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#B8B8B8] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#B8B8B8]">
                  Singha Durbar, Pokhara, Nepal
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#B8B8B8] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#B8B8B8]">
                  +977-1-4211234
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#B8B8B8] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#B8B8B8]">
                  info@sarkaha.gov.np
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-5 mt-10 border-t border-[#3A3A3A]">
          <p className="text-sm text-[#B8B8B8] text-center">
            © {new Date().getFullYear()} Sarkaha Government Portal. All rights reserved. | Government of Nepal
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

