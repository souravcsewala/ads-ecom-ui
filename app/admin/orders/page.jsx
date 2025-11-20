'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminOrderApi } from '../../../lib/adminApi';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlanType, setFilterPlanType] = useState('all'); // 'all', 'standard', 'custom'

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await adminOrderApi.getAll();
      if (response.success) {
        setOrders(response.orders || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - showing empty state');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await adminOrderApi.updateStatus(id, newStatus);
      if (response.success) {
        fetchOrders();
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - test mode');
      // In test mode, just update local state
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const response = await adminOrderApi.delete(id);
      if (response.success) {
        fetchOrders();
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - test mode');
      // In test mode, just remove from local state
      setOrders(orders.filter(o => o._id !== id));
    }
  };

  const filteredOrders = orders.filter(order => {
    // Status filter
    const statusMatch = filterStatus === 'all' || order.status === filterStatus;
    // Plan type filter
    const planTypeMatch = filterPlanType === 'all' || order.planType === filterPlanType;
    return statusMatch && planTypeMatch;
  });

  // Helper function to format order ID - show full database ID
  const formatOrderId = (orderId) => {
    if (!orderId) return 'N/A';
    const idString = typeof orderId === 'string' ? orderId : String(orderId);
    // Show the full database ID
    return idString;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
        <p className="text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Status Filter */}
        <div className="flex gap-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 self-center">Status:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'in_progress'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'completed'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
        
        {/* Plan Type Filter */}
        <div className="flex gap-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 self-center">Plan Type:</span>
          <button
            onClick={() => setFilterPlanType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterPlanType === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Plans
          </button>
          <button
            onClick={() => setFilterPlanType('standard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterPlanType === 'standard'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Standard Plans
          </button>
          <button
            onClick={() => setFilterPlanType('custom')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterPlanType === 'custom'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Custom Plans
          </button>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ad Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  # Ads
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meeting
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">
                    <span className="text-xs">{formatOrderId(order._id)}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customerId?.fullname || order.customerName || 'N/A'}</span>
                      <span className="text-xs text-gray-400">{order.customerId?.email || order.customerEmail || ''}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{order.planName || 'N/A'}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-block w-fit ${
                        order.planType === 'standard' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {order.planType || 'custom'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.adType === 'image' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {order.adType || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {order.numberOfAds || 0}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {order.planType === 'custom' && (order.planPrice === 1 || order.planPrice === 0) ? (
                      <span className="text-purple-600 italic text-xs">Contact for pricing</span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          ₹{(() => {
                            const pricePerAd = order.planPrice || 0;
                            const numberOfAds = order.numberOfAds || 0;
                            const totalPrice = pricePerAd * numberOfAds;
                            return totalPrice.toLocaleString('en-IN');
                          })()}
                        </span>
                        <span className="text-xs text-gray-500 font-normal">
                          ₹{order.planPrice?.toLocaleString('en-IN') || '0'}/{order.adType || 'ad'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' || order.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      order.paymentStatus === 'refunded' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {order.meetingInterest === 'yes' ? (
                      <div className="flex flex-col gap-1">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold inline-block w-fit">
                          Meeting Requested
                        </span>
                        {order.meetingDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(order.meetingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            {order.meetingTime && ` at ${order.meetingTime}`}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No meeting</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

