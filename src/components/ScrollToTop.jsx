import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-10 right-10 w-14 h-14 rounded-full bg-transparent border-2 border-dashed border-[#1E90FF] flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-solid hover:bg-[rgba(30,144,255,0.1)] hover:-translate-y-1 z-[999]"
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} color="#1E90FF" strokeWidth={2} />
    </button>
  )
}

export default ScrollToTop

