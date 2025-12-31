'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminPlanApi } from '../../lib/adminApi';
import { adminOrderApi } from '../../lib/adminApi';
import { adminDemoContentApi } from '../../lib/adminApi';
import { adminTeamApi } from '../../lib/adminApi';
import { adminDashboardApi } from '../../lib/adminApi';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalOrders: 0,
    demoContent: 0,
    teamMembers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    meetingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all data in parallel
      const [
        plansResponse,
        ordersResponse,
        demoContentResponse,
        teamResponse,
        dashboardStatsResponse,
      ] = await Promise.allSettled([
        adminPlanApi.getAllPlans(),
        adminOrderApi.getAll(),
        adminDemoContentApi.getAll(),
        adminTeamApi.getAll(),
        adminDashboardApi.getStats(),
      ]);

      // Extract counts
      const totalPlans = plansResponse.status === 'fulfilled' && plansResponse.value.success
        ? (plansResponse.value.plans || []).length
        : 0;

      const orders = ordersResponse.status === 'fulfilled' && ordersResponse.value.success
        ? (ordersResponse.value.orders || [])
        : [];

      const totalOrders = orders.length;
      const meetingRequests = orders.filter(order => order.meetingInterest === 'yes').length;

      const demoContent = demoContentResponse.status === 'fulfilled' && demoContentResponse.value.success
        ? (demoContentResponse.value.contents || []).length
        : 0;

      const teamMembers = teamResponse.status === 'fulfilled' && teamResponse.value.success
        ? (teamResponse.value.teamMembers || []).length
        : 0;

      // Dashboard stats
      const dashboardStats = dashboardStatsResponse.status === 'fulfilled' && dashboardStatsResponse.value.success
        ? dashboardStatsResponse.value.stats || {}
        : {};

      setStats({
        totalPlans,
        totalOrders,
        demoContent,
        teamMembers,
        pendingOrders: dashboardStats.pendingOrders || 0,
        completedOrders: dashboardStats.completedOrders || 0,
        totalRevenue: dashboardStats.totalRevenue || 0,
        meetingRequests,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalPlans}</div>
              <div className="text-gray-600">Total Plans</div>
            </div>
            <div className="text-purple-600 text-4xl">💰</div>
          </div>
          <button
            onClick={() => router.push('/admin/plans')}
            className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            View Plans →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.totalOrders}</div>
              <div className="text-gray-600">Total Orders</div>
              <div className="text-sm text-gray-500 mt-1">
                {stats.pendingOrders} pending • {stats.completedOrders} completed
              </div>
            </div>
            <div className="text-indigo-600 text-4xl">📦</div>
          </div>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Orders →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.demoContent}</div>
              <div className="text-gray-600">Demo Content</div>
            </div>
            <div className="text-green-600 text-4xl">🖼️</div>
          </div>
          <button
            onClick={() => router.push('/admin/demo-content')}
            className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Manage Content →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.teamMembers}</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div className="text-orange-600 text-4xl">👥</div>
          </div>
          <button
            onClick={() => router.push('/admin/team')}
            className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Manage Team →
          </button>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
          <div className="text-2xl font-bold mb-2">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-blue-100">Total Revenue</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-md text-white">
          <div className="text-2xl font-bold mb-2">{stats.pendingOrders}</div>
          <div className="text-yellow-100">Pending Orders</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-md text-white">
          <div className="text-2xl font-bold mb-2">{stats.meetingRequests}</div>
          <div className="text-purple-100">Meeting Requests</div>
          <button
            onClick={() => router.push('/admin/meeting-requests')}
            className="mt-3 text-sm text-white hover:text-purple-100 font-medium underline"
          >
            View Requests →
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/plans"
            className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">Manage Plans</div>
            <div className="text-sm text-gray-600 mt-1">Create and edit pricing plans</div>
          </a>
          <a
            href="/admin/orders"
            className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">View Orders</div>
            <div className="text-sm text-gray-600 mt-1">Manage customer orders</div>
          </a>
          <a
            href="/admin/demo-content"
            className="p-4 border-2 border-green-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">Demo Content</div>
            <div className="text-sm text-gray-600 mt-1">Manage demo images/videos</div>
          </a>
          <a
            href="/admin/portfolio"
            className="p-4 border-2 border-pink-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors"
          >
            <div className="font-semibold text-gray-900">Portfolio</div>
            <div className="text-sm text-gray-600 mt-1">Manage Performance-Driven Designs</div>
          </a>
        </div>
      </div>
    </div>
  );
}
