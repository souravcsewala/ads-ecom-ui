'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export default function MeetingScheduleSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    company: '',
    meetingDate: '',
    meetingTime: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Create a meeting request using the new API
      const meetingData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerContact: formData.contact,
        customerCompany: formData.company,
        meetingDate: formData.meetingDate,
        meetingTime: formData.meetingTime,
        message: formData.message,
      };

      const response = await api.createMeetingRequest(meetingData);

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          contact: '',
          company: '',
          meetingDate: '',
          meetingTime: '',
          message: '',
        });
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        setError(response.message || 'Failed to submit meeting request. Please try again.');
      }
    } catch (err) {
      console.error('Meeting request submission error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="meeting-schedule" className="py-10 md:py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 w-full relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Blurred Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-3xl"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400/10 rotate-45 blur-xl"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-indigo-400/10 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-300/10 rotate-12 blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-pink-400/10 blur-xl"></div>

        {/* Animated Floating Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-300/20 blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-300/20 blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-pink-300/20 blur-md animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Heading and Subheading */}
          <div className="text-white relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Are You Interested in Direct Contact?
            </h2>
            <p className="text-lg md:text-xl text-purple-100 leading-relaxed">
              Schedule a meeting with our team to discuss your ad requirements and get personalized recommendations.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white shadow-2xl p-8 border-2 border-purple-200">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
                ✓ Meeting request submitted successfully! We will contact you shortly to confirm the schedule.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    placeholder="Enter your contact number"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company name (optional)"
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Meeting Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                    min={getMinDate()}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Meeting Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.meetingTime}
                    onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your requirements or any specific questions you'd like to discuss..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-600 focus:outline-none transition-colors resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-none font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Schedule Meeting'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By scheduling a meeting, you agree to be contacted by our team. We respect your privacy and will only use your information for communication purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

