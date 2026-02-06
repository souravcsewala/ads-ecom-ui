'use client';

import { useState, useEffect } from 'react';
import { authApi } from '../lib/api';

export default function BuyFormModal({ isOpen, onClose, adType, planName, planPrice, planId = null, numberOfAds = null }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Initialize form data with default single ad
  const getInitialFormData = (adsCount = 1) => ({
    // Step 1 fields
    imageDimensions: '',
    brandAssetsLink: '',
    specificInstructions: '',
    ads: Array.from({ length: adsCount }, () => ({
      referenceImageUrl: '',
      productPageUrl: '',
      specificInstructions: '',
    })),
    // Step 2 fields
    name: '',
    email: '',
    contact: '',
    company: '',
    additionalNotes: '',
    // Meeting fields
    meetingInterest: 'no', // 'yes' or 'no'
    meetingDate: '',
    meetingTime: '',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  const isVideo = adType === 'video';

  // Determine plan type: if planId exists, it's a standard plan, otherwise custom
  const planType = planId ? 'standard' : 'custom';

  // Reset form when modal opens with a new numberOfAds
  useEffect(() => {
    if (isOpen) {
      if (numberOfAds && numberOfAds > 0) {
        const adsCount = Math.max(1, Math.min(numberOfAds, 50)); // Limit between 1 and 50
        setFormData(getInitialFormData(adsCount));
      } else {
        // Reset to single ad if no numberOfAds specified
        setFormData(getInitialFormData(1));
      }
      setStep(1);
      setError('');
      setSuccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, numberOfAds]);

  if (!isOpen) return null;

  const handleInputChange = (field, value, adIndex = null) => {
    if (adIndex !== null) {
      setFormData((prev) => ({
        ...prev,
        ads: prev.ads.map((ad, idx) =>
          idx === adIndex ? { ...ad, [field]: value } : ad
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addAnotherAd = () => {
    setFormData((prev) => ({
      ...prev,
      ads: [
        ...prev.ads,
        {
          referenceImageUrl: '',
          productPageUrl: '',
          specificInstructions: '',
        },
      ],
    }));
  };

  const removeAd = (index) => {
    if (formData.ads.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ads: prev.ads.filter((_, idx) => idx !== index),
      }));
    }
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (step < 2) {
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

    // CRITICAL: Only allow submission on Step 2 - prevent any submission on Step 1
    if (step !== 2) {
      console.log('Form submission blocked: not on step 2. Current step:', step);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Get auth token if available (optional for guest orders)
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

      // Prepare order data
      // Parse planPrice - handle cases like "Contact for pricing" or currency strings
      // For custom plans, use a default price of 1 (backend requires > 0)
      let parsedPrice = 1; // Default to 1 for custom plans
      if (planPrice && planPrice !== 'Contact for pricing') {
        const priceStr = String(planPrice);
        // Check if it contains numbers
        const priceMatch = priceStr.match(/[\d,]+\.?\d*/);
        if (priceMatch) {
          const extractedPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
          if (!isNaN(extractedPrice) && extractedPrice > 0) {
            parsedPrice = extractedPrice;
          }
        }
      }

      const sanitizedAds =
        formData.ads && formData.ads.length > 0
          ? formData.ads
          : [
            {
              referenceImageUrl: '',
              productPageUrl: '',
              specificInstructions: '',
            },
          ];

      const mappedAds = sanitizedAds.map((ad, idx) => ({
        referenceImageUrl:
          ad.referenceImageUrl?.trim() ||
          `https://example.com/reference-${idx + 1}`,
        productPageUrl:
          ad.productPageUrl?.trim() ||
          `https://example.com/product-${idx + 1}`,
        specificInstructions:
          ad.specificInstructions?.trim() || 'No instructions provided.',
      }));

      const orderData = {
        planType,
        planId: planId || null,
        planName: planName || 'Custom Plan',
        planPrice: parsedPrice,
        adType: isVideo ? 'video' : 'image',
        numberOfAds: mappedAds.length,
        imageDimensions: isVideo
          ? ''
          : formData.imageDimensions?.trim() || 'Not provided',
        brandAssetsLink:
          formData.brandAssetsLink?.trim() || 'https://example.com/brand-assets',
        generalInstructions:
          formData.specificInstructions?.trim() || 'Not provided',
        ads: mappedAds,
        customerName: formData.name?.trim() || 'Guest Customer',
        customerEmail: formData.email?.trim() || 'guest@example.com',
        customerContact: formData.contact?.trim() || '0000000000',
        customerCompany: formData.company || '',
        additionalNotes: formData.additionalNotes || '',
        // Meeting information
        meetingInterest: formData.meetingInterest || 'no',
        meetingDate: formData.meetingInterest === 'yes' ? formData.meetingDate || '' : '',
        meetingTime: formData.meetingInterest === 'yes' ? formData.meetingTime || '' : '',
      };

      console.log('Submitting order:', JSON.stringify(orderData, null, 2));
      console.log('API endpoint will be: /api/orders/create');
      console.log('Token available:', token ? 'Yes' : 'No (guest order)');
      console.log('Validation check:', {
        planType: !!orderData.planType,
        planName: !!orderData.planName,
        planPrice: orderData.planPrice > 0,
        adType: !!orderData.adType,
        numberOfAds: orderData.numberOfAds > 0,
        brandAssetsLink: !!orderData.brandAssetsLink,
        adsCount: orderData.ads.length,
      });

      // Submit order to API (token is optional for guest orders)
      const response = await authApi.createOrder(orderData, token);

      if (response.success) {
        setSuccess(true);
        console.log('Order created successfully:', response.order);

        // Reset form after success
        setTimeout(() => {
          setStep(1);
          setFormData({
            imageDimensions: '',
            brandAssetsLink: '',
            specificInstructions: '',
            ads: [
              {
                referenceImageUrl: '',
                productPageUrl: '',
                specificInstructions: '',
              },
            ],
            name: '',
            email: '',
            contact: '',
            company: '',
            additionalNotes: '',
          });
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to create order. Please try again.');
      }
    } catch (error) {
      // Extract error message from various possible locations
      let errorMessage = 'Failed to submit order. Please check your connection and try again.';

      if (error.response) {
        // Server responded with error
        const responseData = error.response.data;
        errorMessage = responseData?.message ||
          responseData?.error ||
          `Server error: ${error.response.status} ${error.response.statusText}`;

        console.error('Order submission error (Server Response):', {
          message: errorMessage,
          status: error.response.status,
          statusText: error.response.statusText,
          responseData: responseData,
        });
      } else if (error.request) {
        // Request was made but no response received (network error)
        errorMessage = 'Network error: Unable to connect to server. Please check your internet connection and ensure the backend server is running on http://localhost:7050';
        console.error('Order submission error (Network):', {
          message: error.message,
          code: error.code,
        });
      } else {
        // Error in request setup
        errorMessage = error.message || errorMessage;
        console.error('Order submission error (Request Setup):', {
          message: error.message,
          stack: error.stack,
        });
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setFormData(getInitialFormData(1));
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
            <h2 className="text-2xl font-bold text-gray-900">BuyEcomAds</h2>
            {planName && (
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {planName} - {planPrice}
              </span>
            )}
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
            <span className="text-sm font-medium text-gray-700">Step {step} of 2</span>
            <span className="text-sm text-gray-500">{Math.round((step / 2) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
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
              Order submitted successfully! Redirecting...
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Only allow submission on step 2
              if (step === 2) {
                handleSubmit(e);
              }
              // On step 1, do nothing - Next button handles navigation
              return false;
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from submitting form on step 1
              if (e.key === 'Enter' && step === 1) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }}
          >
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {/* What image style are you looking for? */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    What {isVideo ? 'video' : 'image'} style are you looking for?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Share your brand assets and reference materials for each {isVideo ? 'video' : 'image'} ad you need. This helps us understand your vision and create exactly what you want.
                  </p>
                  {numberOfAds && numberOfAds > 1 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-blue-900">
                        ✓ Form pre-filled with {numberOfAds} {isVideo ? 'video' : 'image'} ad{numberOfAds > 1 ? 's' : ''} based on your selected plan
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Dimensions */}
                {!isVideo && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Image Dimensions <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.imageDimensions}
                      onChange={(e) => handleInputChange('imageDimensions', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors bg-gray-50"
                    >
                      <option value="">Select image dimensions</option>
                      <option value="1080x1080">1080x1080 (Square - Instagram)</option>
                      <option value="1200x628">1200x628 (Facebook)</option>
                      <option value="1080x1350">1080x1350 (Stories)</option>
                      <option value="1920x1080">1920x1080 (Landscape)</option>
                      <option value="1080x1920">1080x1920 (Portrait)</option>
                    </select>
                  </div>
                )}

                {/* Brand Assets Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Brand Assets Link
                    <button
                      type="button"
                      className="ml-2 w-5 h-5 rounded-none bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs text-gray-600"
                      title="Share any link (Drive, Dropbox, Notion, etc.) that contains your brand assets"
                    >
                      ?
                    </button>
                  </label>
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-3">
                    <p className="text-sm text-gray-700 mb-2 font-medium">
                      Share a link to a folder (Drive, Dropbox, Notion, etc.) that includes:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Product images/photos (high resolution)</li>
                      <li>Product videos or footage (if available)</li>
                      <li>Brand guidelines or style guide</li>
                      <li>Logo files (PNG, SVG, or high-res formats)</li>
                      <li>Brand fonts (if you use custom fonts)</li>
                      <li>Color palette/brand colors</li>
                    </ul>
                  </div>
                  <input
                    type="url"
                    value={formData.brandAssetsLink}
                    onChange={(e) => handleInputChange('brandAssetsLink', e.target.value)}
                    placeholder="https://yourlink.com/folder - Share where we can access your brand assets"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Multiple Ads Made Easy */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Multiple Ads Made Easy</h4>
                      <p className="text-sm text-gray-700">
                        For each ad, provide a reference {isVideo ? 'video' : 'image'} and the specific product page. This allows us to create targeted ads that match your style while promoting the right products.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Ads Section */}
                {formData.ads.map((ad, adIndex) => (
                  <div key={adIndex} className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">
                        {isVideo ? 'Video' : 'Image'} Ad {adIndex + 1}
                      </h4>
                      {formData.ads.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAd(adIndex)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Reference {isVideo ? 'Video' : 'Image'} URL
                      </label>
                      <input
                        type="url"
                        value={ad.referenceImageUrl}
                        onChange={(e) => handleInputChange('referenceImageUrl', e.target.value, adIndex)}
                        placeholder={`https://example.com/${isVideo ? 'video' : 'image'}.${isVideo ? 'mp4' : 'jpg'}... - Show us the exact style you want.`}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Product Page URL
                      </label>
                      <input
                        type="url"
                        value={ad.productPageUrl}
                        onChange={(e) => handleInputChange('productPageUrl', e.target.value, adIndex)}
                        placeholder="https://yourstore.com/product - The product this ad will promote."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Specific Instructions for this Ad
                      </label>
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-3">
                        <div className="flex items-start gap-2 mb-2">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm font-medium text-gray-900">
                            Help us create the perfect ad by answering these questions:
                          </p>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside ml-7">
                          <li>What are your brand colors and visual style preferences?</li>
                          <li>What&apos;s your brand tone and personality (professional, playful, luxury, etc.)?</li>
                          <li>Are there any design elements or styles you want to avoid?</li>
                          <li>Who is your target audience for this specific ad?</li>
                          <li>What call-to-action do you want? (e.g., "Shop Now", "Learn More", "Sign Up")</li>
                          <li>Which platforms will you use this ad on? (e.g., Instagram, Facebook, TikTok, YouTube)</li>
                        </ul>
                      </div>
                      <textarea
                        value={ad.specificInstructions}
                        onChange={(e) => handleInputChange('specificInstructions', e.target.value, adIndex)}
                        placeholder="Answer the guidance questions above to help us create your perfect ad. Include details about your brand style, target audience, call-to-action, target platforms, and any specific requirements..."
                        rows={6}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors resize-y"
                      />
                    </div>
                  </div>
                ))}

                {/* Add Another Ad Button */}
                <button
                  type="button"
                  onClick={addAnotherAd}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-none text-gray-700 font-medium hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all"
                >
                  + Add Another {isVideo ? 'Video' : 'Image'} Ad
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Details</h3>
                <p className="text-gray-600 mb-6">
                  Please provide your contact information so we can reach out to you about your order.
                </p>

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

                {/* Meeting Interest Section */}
                <div className="border-t border-gray-200 pt-6 mt-6">
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

                  {/* Meeting Date and Time Fields - Show only if Yes is selected */}
                  {formData.meetingInterest === 'yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Meeting Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.meetingDate}
                          onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
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
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={step === 1 ? handleClose : handleBack}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-none font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              {step === 1 ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNext(e);
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-none font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-none font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Order'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

