'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminMeetingRequestApi, adminOrderApi } from '../../../lib/adminApi';

export default function MeetingRequestsPage() {
  const router = useRouter();
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'

  useEffect(() => {
    fetchMeetingRequests();
  }, [filterStatus]);

  const fetchMeetingRequests = async () => {
    try {
      setIsLoading(true);

      // Fetch both meeting requests and orders with meeting interest
      const [meetingRequestsResponse, ordersResponse] = await Promise.all([
        adminMeetingRequestApi.getAll(),
        adminOrderApi.getAll(),
      ]);

      let allMeetings = [];

      // Add meeting requests from MeetingRequest model
      if (meetingRequestsResponse.success && meetingRequestsResponse.meetingRequests) {
        const meetingReqs = meetingRequestsResponse.meetingRequests.map(req => ({
          ...req,
          source: 'meeting-request', // Mark as from MeetingRequest model
          id: req._id,
        }));
        allMeetings = [...allMeetings, ...meetingReqs];
      }

      // Add meetings from orders (BuyFormModal and CustomPlanModal)
      if (ordersResponse.success && ordersResponse.orders) {
        const orderMeetings = ordersResponse.orders
          .filter(order => order.meetingInterest === 'yes' && order.meetingDate)
          .map(order => ({
            _id: order._id,
            id: order._id,
            source: 'order', // Mark as from Order model
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerContact: order.customerContact,
            customerCompany: order.customerCompany || '',
            meetingDate: order.meetingDate,
            meetingTime: order.meetingTime,
            message: order.additionalNotes || order.generalInstructions || '',
            status: order.status === 'completed' ? 'completed' :
              order.status === 'cancelled' ? 'cancelled' : 'pending',
            adminNotes: '',
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            orderId: order._id, // Keep reference to original order
            planName: order.planName,
            planType: order.planType,
          }));
        allMeetings = [...allMeetings, ...orderMeetings];
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        allMeetings = allMeetings.filter(req => req.status === filterStatus);
      }

      // Sort by date (newest first)
      allMeetings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setMeetingRequests(allMeetings);
    } catch (error) {
      console.error('Error fetching meeting requests:', error);
      setMeetingRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus, source) => {
    try {
      if (source === 'meeting-request') {
        // Update meeting request status
        const response = await adminMeetingRequestApi.updateStatus(id, newStatus);
        if (response.success) {
          fetchMeetingRequests(); // Refresh list
        }
      } else if (source === 'order') {
        // For orders, we can update the order status (which affects meeting status)
        // Note: Orders don't have separate meeting status, so we update order status
        const response = await adminOrderApi.updateStatus(id, newStatus);
        if (response.success) {
          fetchMeetingRequests(); // Refresh list
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, source) => {
    if (!confirm('Are you sure you want to delete this meeting request?')) {
      return;
    }

    try {
      if (source === 'meeting-request') {
        const response = await adminMeetingRequestApi.delete(id);
        if (response.success) {
          fetchMeetingRequests(); // Refresh list
        }
      } else if (source === 'order') {
        // For orders, we might want to just remove meeting interest or delete the order
        // For now, we'll just refresh - deleting orders should be done from orders page
        alert('To delete this meeting, please go to the Orders page and manage the order there.');
        fetchMeetingRequests(); // Refresh list
      }
    } catch (error) {
      console.error('Error deleting meeting request:', error);
      alert('Failed to delete meeting request');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getUpcomingCount = () => {
    const now = new Date();
    return meetingRequests.filter(req => {
      if (req.status === 'cancelled') return false;
      const meetingDateTime = new Date(`${req.meetingDate}T${req.meetingTime || '00:00'}`);
      return meetingDateTime >= now;
    }).length;
  };

  const getPastCount = () => {
    const now = new Date();
    return meetingRequests.filter(req => {
      const meetingDateTime = new Date(`${req.meetingDate}T${req.meetingTime || '00:00'}`);
      return meetingDateTime < now;
    }).length;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading meeting requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Requests</h1>
        <p className="text-gray-600">Manage all meeting requests from customers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">{meetingRequests.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {meetingRequests.filter(r => r.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Upcoming</div>
          <div className="text-2xl font-bold text-green-600">{getUpcomingCount()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Past</div>
          <div className="text-2xl font-bold text-gray-600">{getPastCount()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'pending'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilterStatus('confirmed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'confirmed'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'completed'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'cancelled'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          Cancelled
        </button>
      </div>

      {/* Meeting Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meeting Date &amp; Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {meetingRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No meeting requests found
                </td>
              </tr>
            ) : (
              meetingRequests.map((request) => {
                const meetingDateTime = new Date(`${request.meetingDate}T${request.meetingTime || '00:00'}`);
                const isUpcoming = meetingDateTime >= new Date();
                const source = request.source || 'meeting-request';

                return (
                  <tr key={request._id || request.id} className={isUpcoming ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                      <div className="text-sm text-gray-500">{request.customerEmail}</div>
                      {request.customerCompany && (
                        <div className="text-xs text-gray-400">{request.customerCompany}</div>
                      )}
                      {source === 'order' && (
                        <div className="text-xs text-purple-600 mt-1">
                          From: {request.planName || 'Order'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.meetingDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">{request.meetingTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.customerContact}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={request.status}
                        onChange={(e) => handleStatusUpdate(request._id || request.id, e.target.value, source)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 ${getStatusBadgeClass(request.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {source === 'meeting-request' ? (
                          <button
                            onClick={() => router.push(`/admin/meeting-requests/${request._id || request.id}`)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => router.push(`/admin/orders/${request.orderId || request._id || request.id}`)}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            View Order
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(request._id || request.id, source)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
