'use client';

import { useState, useEffect } from 'react';
import { authApi } from '../lib/api';

export default function CustomPlanModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Ad Type
    adType: 'image', // 'image' or 'video'
    // Step 2: Number of ads and budget
    numberOfAds: '',
    budget: '',
    // Step 3: Customer details
    name: '',
    email: '',
    contact: '',
    company: '',
    additionalNotes: '',
    // Meeting
    meetingInterest: 'no',
    meetingDate: '',
    meetingTime: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        adType: 'image',
        numberOfAds: '',
        budget: '',
        name: '',
        email: '',
        contact: '',
        company: '',
        additionalNotes: '',
        meetingInterest: 'no',
        meetingDate: '',
        meetingTime: '',
      });
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (step !== 4) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      // Prepare order data for custom plan
      const numberOfAds = parseInt(formData.numberOfAds) || 1;
      const budget = parseFloat(formData.budget) || 0;

      // Create placeholder ads array
      const ads = Array.from({ length: numberOfAds }, (_, idx) => ({
        referenceImageUrl: `https://example.com/reference-${idx + 1}`,
        productPageUrl: `https://example.com/product-${idx + 1}`,
        specificInstructions: 'Custom plan - details to be discussed.',
      }));

      const orderData = {
        planType: 'custom',
        planId: null,
        planName: `Custom ${formData.adType === 'video' ? 'Video' : 'Image'} Plan`,
        planPrice: budget > 0 ? budget : 1, // Use budget or default to 1
        adType: formData.adType,
        numberOfAds: numberOfAds,
        imageDimensions: formData.adType === 'image' ? 'To be determined' : '',
        brandAssetsLink: 'https://example.com/brand-assets',
        generalInstructions: `Custom plan request: ${numberOfAds} ${formData.adType === 'video' ? 'videos' : 'images'} with budget of ₹${budget.toLocaleString('en-IN')}. Details to be discussed.`,
        ads: ads,
        customerName: formData.name?.trim() || 'Guest Customer',
        customerEmail: formData.email?.trim() || 'guest@example.com',
        customerContact: formData.contact?.trim() || '0000000000',
        customerCompany: formData.company || '',
        additionalNotes: formData.additionalNotes || '',
        meetingInterest: formData.meetingInterest || 'no',
        meetingDate: formData.meetingInterest === 'yes' ? formData.meetingDate || '' : '',
        meetingTime: formData.meetingInterest === 'yes' ? formData.meetingTime || '' : '',
      };

      const response = await authApi.createOrder(orderData, token);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
          // Optionally redirect or show success message
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting custom plan:', error);
      setError(error.response?.data?.message || error.message || 'Failed to submit custom plan request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setError('');
    setSuccess(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 my-8 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Custom Plan Request</h2>
            <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
              {formData.adType === 'video' ? 'Video Ads' : 'Image Ads'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Custom plan request submitted successfully! We&apos;ll contact you soon.
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (step === 4) {
                handleSubmit(e);
              }
              return false;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && step < 4) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }}
          >
            {/* Step 1: Choose Ad Type */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    What type of ads do you need?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Choose between professional image ads or video ads for your custom plan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.adType === 'image'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    onClick={() => handleInputChange('adType', 'image')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${formData.adType === 'image'
                        ? 'bg-purple-600'
                        : 'bg-gray-200'
                        }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Image Ads</h4>
                        <p className="text-sm text-gray-600">Professional static image advertisements</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.adType === 'video'
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                      }`}
                    onClick={() => handleInputChange('adType', 'video')}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${formData.adType === 'video'
                        ? 'bg-purple-600'
                        : 'bg-gray-200'
                        }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">Video Ads</h4>
                        <p className="text-sm text-gray-600">Professional video advertisements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Number of Ads and Budget */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    How many {formData.adType === 'video' ? 'videos' : 'images'} do you need?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Enter the number of {formData.adType === 'video' ? 'video ads' : 'image ads'} you want and your budget.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of {formData.adType === 'video' ? 'Videos' : 'Images'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.numberOfAds}
                    onChange={(e) => handleInputChange('numberOfAds', e.target.value)}
                    placeholder={`Enter number of ${formData.adType === 'video' ? 'videos' : 'images'}`}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Budget (₹) <span className="text-red-500">*</span>
                    <span className="text-gray-500 font-normal ml-2">per {formData.adType === 'video' ? 'video' : 'image'}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder={`Enter your budget per ${formData.adType === 'video' ? 'video' : 'image'} in ₹`}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Enter your budget per {formData.adType === 'video' ? 'video' : 'image'}. We&apos;ll review your budget and get back to you with a customized quote.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Customer Details */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Details</h3>
                  <p className="text-gray-600 mb-6">
                    Please provide your contact information so we can reach out to you about your custom plan.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information or special requests..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors resize-y"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Meeting Section */}
            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Meeting Request</h3>
                  <p className="text-gray-600 mb-6">
                    Would you like to schedule a meeting to discuss your custom plan in detail?
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Are you interested for a meeting?
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="meetingInterest"
                        value="yes"
                        checked={formData.meetingInterest === 'yes'}
                        onChange={(e) => handleInputChange('meetingInterest', e.target.value)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-gray-700 font-medium">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="meetingInterest"
                        value="no"
                        checked={formData.meetingInterest === 'no'}
                        onChange={(e) => handleInputChange('meetingInterest', e.target.value)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-gray-700 font-medium">No</span>
                    </label>
                  </div>
                </div>

                {formData.meetingInterest === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Meeting Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.meetingDate}
                        onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required={formData.meetingInterest === 'yes'}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Meeting Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        value={formData.meetingTime}
                        onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                        required={formData.meetingInterest === 'yes'}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Request Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ad Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{formData.adType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of {formData.adType === 'video' ? 'Videos' : 'Images'}:</span>
                      <span className="font-medium text-gray-900">{formData.numberOfAds || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium text-gray-900">
                        {formData.budget ? `₹${parseFloat(formData.budget).toLocaleString('en-IN')}` : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Meeting Requested:</span>
                      <span className="font-medium text-gray-900 capitalize">{formData.meetingInterest}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={step === 1 ? handleClose : handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext(e);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

