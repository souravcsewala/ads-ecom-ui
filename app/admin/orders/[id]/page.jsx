'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminOrderApi } from '../../../../lib/adminApi';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching order with ID:', orderId);
      const response = await adminOrderApi.getById(orderId);
      console.log('Order API response:', response);
      
      if (response.success && response.order) {
        console.log('Order data:', response.order);
        setOrder(response.order);
      } else {
        console.error('Order not found in response:', response);
        setError(response.message || 'Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        responseData: error.response?.data,
        status: error.response?.status,
      });
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to load order details. Please check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await adminOrderApi.updateStatus(orderId, newStatus);
      if (response.success) {
        setOrder({ ...order, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    try {
      const response = await adminOrderApi.updatePaymentStatus(orderId, newPaymentStatus);
      if (response.success) {
        setOrder({ ...order, paymentStatus: newPaymentStatus });
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <p className="text-red-600 text-lg mb-4">{error || 'Order not found'}</p>
        <button
          onClick={() => router.push('/admin/orders')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/orders')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">Order ID: <span className="font-mono text-sm">{order._id}</span></p>
        </div>
        <div className="flex gap-3">
          <select
            value={order.status || 'pending'}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className={`px-4 py-2 rounded-lg font-semibold border-2 ${
              order.status === 'completed' ? 'bg-green-50 border-green-500 text-green-700' :
              order.status === 'processing' || order.status === 'in_progress' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' :
              order.status === 'cancelled' ? 'bg-red-50 border-red-500 text-red-700' :
              'bg-gray-50 border-gray-500 text-gray-700'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={order.paymentStatus || 'pending'}
            onChange={(e) => handlePaymentStatusUpdate(e.target.value)}
            className={`px-4 py-2 rounded-lg font-semibold border-2 ${
              order.paymentStatus === 'paid' ? 'bg-green-50 border-green-500 text-green-700' :
              order.paymentStatus === 'failed' ? 'bg-red-50 border-red-500 text-red-700' :
              order.paymentStatus === 'refunded' ? 'bg-orange-50 border-orange-500 text-orange-700' :
              'bg-gray-50 border-gray-500 text-gray-700'
            }`}
          >
            <option value="pending">Payment Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-500">Order ID</label>
                <p className="text-gray-900 font-mono text-sm mt-1">{order._id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Plan Type</label>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.planType === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {order.planType || 'custom'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Plan Name</label>
                <p className="text-gray-900 mt-1">{order.planName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Ad Type</label>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.adType === 'image' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {order.adType || 'N/A'}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Number of Ads</label>
                <p className="text-gray-900 mt-1">{order.numberOfAds || 0}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">
                  {order.planType === 'custom' ? 'Budget Information' : 'Price Information'}
                </label>
                {order.planType === 'custom' ? (
                  <div className="mt-1">
                    {order.planPrice > 1 ? (
                      <>
                        <p className="text-gray-900 font-semibold text-lg">
                          Budget: ₹{order.planPrice.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-purple-600 mt-1">
                          {order.numberOfAds} {order.adType === 'video' ? 'videos' : 'images'} requested
                        </p>
                        <p className="text-xs text-gray-500 mt-2 italic">
                          Custom plan - pricing to be discussed
                        </p>
                      </>
                    ) : (
                      <p className="text-purple-600 italic mt-1">Budget not specified - Contact for pricing</p>
                    )}
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-gray-900 font-semibold">
                      Total: ₹{(() => {
                        const pricePerAd = order.planPrice || 0;
                        const numberOfAds = order.numberOfAds || 0;
                        const totalPrice = pricePerAd * numberOfAds;
                        return totalPrice.toLocaleString('en-IN');
                      })()}
                    </p>
                    {order.planPrice > 0 && order.numberOfAds > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{order.planPrice?.toLocaleString('en-IN')} per {order.adType || 'ad'} × {order.numberOfAds} {order.adType === 'video' ? 'videos' : 'images'} = ₹{(() => {
                          const pricePerAd = order.planPrice || 0;
                          const numberOfAds = order.numberOfAds || 0;
                          const totalPrice = pricePerAd * numberOfAds;
                          return totalPrice.toLocaleString('en-IN');
                        })()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {order.imageDimensions && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Image Dimensions</label>
                  <p className="text-gray-900 mt-1">{order.imageDimensions}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-500">Payment Status</label>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                    order.paymentStatus === 'refunded' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.paymentStatus || 'pending'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Brand Assets & Instructions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {order.planType === 'custom' ? 'Custom Plan Details & Instructions' : 'Brand Assets & Instructions'}
            </h2>
            <div className="space-y-4">
              {order.planType === 'custom' && (
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Custom Plan Request</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ad Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{order.adType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Number of {order.adType === 'video' ? 'Videos' : 'Images'}:</span>
                      <span className="font-medium text-gray-900">{order.numberOfAds}</span>
                    </div>
                    {order.planPrice > 1 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer Budget:</span>
                        <span className="font-medium text-purple-700">₹{order.planPrice.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-500">Brand Assets Link</label>
                <p className="text-gray-900 mt-1 break-all">
                  <a href={order.brandAssetsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {order.brandAssetsLink}
                  </a>
                </p>
              </div>
              {order.generalInstructions && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    {order.planType === 'custom' ? 'Custom Requirements & Notes' : 'General Instructions'}
                  </label>
                  <p className="text-gray-900 mt-1 whitespace-pre-wrap">{order.generalInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Individual Ads */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Individual Ads ({order.ads?.length || 0})</h2>
            <div className="space-y-4">
              {order.ads && order.ads.length > 0 ? (
                order.ads.map((ad, index) => (
                  <div key={ad._id || index} className="border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Ad #{ad.adNumber || index + 1}</h3>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        ad.status === 'completed' ? 'bg-green-100 text-green-700' :
                        ad.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        ad.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ad.status || 'not_started'}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Reference Image/Video URL</label>
                        <p className="text-gray-900 mt-1 break-all">
                          <a href={ad.referenceImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {ad.referenceImageUrl}
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Product Page URL</label>
                        <p className="text-gray-900 mt-1 break-all">
                          <a href={ad.productPageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {ad.productPageUrl}
                          </a>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-500">Specific Instructions</label>
                        <p className="text-gray-900 mt-1 whitespace-pre-wrap">{ad.specificInstructions}</p>
                      </div>
                      {ad.deliveryFile?.url && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500">Delivery File</label>
                          <p className="text-gray-900 mt-1">
                            <a href={ad.deliveryFile.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              View Delivery File
                            </a>
                          </p>
                        </div>
                      )}
                      {ad.deliveryDate && (
                        <div>
                          <label className="text-sm font-semibold text-gray-500">Delivery Date</label>
                          <p className="text-gray-900 mt-1">{formatDate(ad.deliveryDate)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No ads found</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500">Name</label>
                <p className="text-gray-900 mt-1">{order.customerId?.fullname || order.customerName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <p className="text-gray-900 mt-1 break-all">{order.customerId?.email || order.customerEmail || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Contact</label>
                <p className="text-gray-900 mt-1">{order.customerId?.phone || order.customerContact || 'N/A'}</p>
              </div>
              {order.customerCompany && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Company</label>
                  <p className="text-gray-900 mt-1">{order.customerCompany}</p>
                </div>
              )}
            </div>
          </div>

          {/* Meeting Information */}
          {order.meetingInterest === 'yes' && (
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900">Meeting Request</h2>
                <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                  Scheduled
                </span>
              </div>
              <div className="space-y-4">
                {order.meetingDate && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Meeting Date</label>
                    <p className="text-gray-900 mt-1 font-medium">
                      {new Date(order.meetingDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                      })}
                    </p>
                  </div>
                )}
                {order.meetingTime && (
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Meeting Time</label>
                    <p className="text-gray-900 mt-1 font-medium">
                      {order.meetingTime}
                    </p>
                  </div>
                )}
                {order.meetingDate && order.meetingTime && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Full Schedule:</span>{' '}
                      {new Date(order.meetingDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at {order.meetingTime}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Dates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Dates</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500">Order Date</label>
                <p className="text-gray-900 mt-1">{formatDate(order.orderDate || order.createdAt)}</p>
              </div>
              {order.completedDate && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Completed Date</label>
                  <p className="text-gray-900 mt-1">{formatDate(order.completedDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {order.additionalNotes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Notes</h2>
              <p className="text-gray-900 whitespace-pre-wrap">{order.additionalNotes}</p>
            </div>
          )}

          {/* Payment Information */}
          {order.paymentId && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
              <div>
                <label className="text-sm font-semibold text-gray-500">Payment ID</label>
                <p className="text-gray-900 font-mono text-sm mt-1">{order.paymentId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

