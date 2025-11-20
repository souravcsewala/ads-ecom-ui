'use client';

import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleMenuClick = (id) => {
    scrollToSection(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-between">
            <div
              className="text-2xl font-bold cursor-pointer text-purple-600"
              onClick={() => scrollToSection('hero')}
            >
              BuyEcomAds
            </div>
            <div className="flex items-center gap-8">
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('team')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Our Team
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
              >
                Testimonials
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="p-2 text-gray-700 hover:text-purple-600 transition-colors hover:bg-purple-50 rounded-lg"
                aria-label="Login or Sign Up"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  // Trigger buy modal via custom event
                  window.dispatchEvent(new CustomEvent('openBuyModal'));
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Buy Professional Ads
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <div
              className="text-lg font-bold cursor-pointer text-purple-600 flex-shrink-0"
              onClick={() => scrollToSection('hero')}
            >
              BuyEcomAds
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openBuyModal'));
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-xs hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md whitespace-nowrap"
              >
                Buy Professional Ads
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Sidebar */}
        <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-purple-600">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-4">
              <button
                onClick={() => handleMenuClick('pricing')}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => handleMenuClick('how-it-works')}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
              >
                How it Works
              </button>
              <button
                onClick={() => handleMenuClick('team')}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
              >
                Our Team
              </button>
              <button
                onClick={() => handleMenuClick('testimonials')}
                className="w-full text-left px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
              >
                Testimonials
              </button>

              <div className="border-t border-gray-200 my-6" />

              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Login / Sign Up</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

