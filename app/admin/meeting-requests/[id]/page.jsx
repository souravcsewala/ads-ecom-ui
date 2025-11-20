'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { adminMeetingRequestApi } from '../../../../lib/adminApi';

export default function MeetingRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [meetingRequest, setMeetingRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMeetingRequest();
    }
  }, [params.id]);

  const fetchMeetingRequest = async () => {
    try {
      setIsLoading(true);
      const response = await adminMeetingRequestApi.getById(params.id);
      
      if (response.success && response.meetingRequest) {
        setMeetingRequest(response.meetingRequest);
        setAdminNotes(response.meetingRequest.adminNotes || '');
      }
    } catch (error) {
      console.error('Error fetching meeting request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      const response = await adminMeetingRequestApi.updateStatus(params.id, newStatus, adminNotes);
      if (response.success) {
        setMeetingRequest(response.meetingRequest);
        alert('Status updated successfully');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotesUpdate = async () => {
    try {
      setIsUpdating(true);
      const response = await adminMeetingRequestApi.updateStatus(
        params.id,
        meetingRequest.status,
        adminNotes
      );
      if (response.success) {
        setMeetingRequest(response.meetingRequest);
        alert('Notes updated successfully');
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      alert('Failed to update notes');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading meeting request...</div>
        </div>
      </div>
    );
  }

  if (!meetingRequest) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Meeting Request Not Found</h1>
          <button
            onClick={() => router.push('/admin/meeting-requests')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Meeting Requests
          </button>
        </div>
      </div>
    );
  }

  const meetingDateTime = new Date(`${meetingRequest.meetingDate}T${meetingRequest.meetingTime || '00:00'}`);
  const isUpcoming = meetingDateTime >= new Date();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/admin/meeting-requests')}
            className="text-purple-600 hover:text-purple-800 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Meeting Requests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Meeting Request Details</h1>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={meetingRequest.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={isUpdating}
            className={`px-4 py-2 rounded-lg font-semibold border-2 ${
              meetingRequest.status === 'confirmed' ? 'bg-green-50 border-green-500 text-green-700' :
              meetingRequest.status === 'completed' ? 'bg-blue-50 border-blue-500 text-blue-700' :
              meetingRequest.status === 'cancelled' ? 'bg-red-50 border-red-500 text-red-700' :
              'bg-yellow-50 border-yellow-500 text-yellow-700'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-500">Full Name</label>
                <p className="text-gray-900 mt-1">{meetingRequest.customerName}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <p className="text-gray-900 mt-1">
                  <a href={`mailto:${meetingRequest.customerEmail}`} className="text-purple-600 hover:underline">
                    {meetingRequest.customerEmail}
                  </a>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Contact Number</label>
                <p className="text-gray-900 mt-1">
                  <a href={`tel:${meetingRequest.customerContact}`} className="text-purple-600 hover:underline">
                    {meetingRequest.customerContact}
                  </a>
                </p>
              </div>
              {meetingRequest.customerCompany && (
                <div>
                  <label className="text-sm font-semibold text-gray-500">Company</label>
                  <p className="text-gray-900 mt-1">{meetingRequest.customerCompany}</p>
                </div>
              )}
            </div>
          </div>

          {/* Meeting Details */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900">Meeting Schedule</h2>
              {isUpcoming && (
                <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Upcoming
                </span>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-500">Meeting Date</label>
                <p className="text-gray-900 mt-1">
                  {new Date(meetingRequest.meetingDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Meeting Time</label>
                <p className="text-gray-900 mt-1">{meetingRequest.meetingTime}</p>
              </div>
              {meetingRequest.meetingDate && meetingRequest.meetingTime && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Full Schedule:</span>{' '}
                    {meetingDateTime.toLocaleString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Message */}
          {meetingRequest.message && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Message</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{meetingRequest.message}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Admin Notes</h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this meeting request..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors resize-y"
            />
            <button
              onClick={handleNotesUpdate}
              disabled={isUpdating}
              className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Save Notes'}
            </button>
          </div>

          {/* Request Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-500">Request ID</label>
                <p className="text-gray-900 mt-1 font-mono text-xs">{meetingRequest._id}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Status</label>
                <p className="text-gray-900 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    meetingRequest.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    meetingRequest.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    meetingRequest.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {meetingRequest.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Submitted</label>
                <p className="text-gray-900 mt-1">
                  {new Date(meetingRequest.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">Last Updated</label>
                <p className="text-gray-900 mt-1">
                  {new Date(meetingRequest.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a
                href={`mailto:${meetingRequest.customerEmail}?subject=Meeting Confirmation - ${meetingRequest.customerName}`}
                className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center"
              >
                Send Email
              </a>
              <a
                href={`tel:${meetingRequest.customerContact}`}
                className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
              >
                Call Customer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

