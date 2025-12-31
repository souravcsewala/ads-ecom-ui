'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { adminAuthApi } from '../../lib/adminApi';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsLoading(false);
      setIsAuthenticated(true);
      return;
    }
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // For initial testing - allow access without token
      // Remove this in production!
      const allowTestMode = true; // Set to false in production
      
      if (!token && !allowTestMode) {
        router.push('/admin/login');
        return;
      }

      if (!token && allowTestMode) {
        // Test mode - allow access without authentication
        setIsAuthenticated(true);
        setAdminData({ fullname: 'Test Admin', email: 'test@admin.com', role: 'admin' });
        setIsLoading(false);
        return;
      }

      const response = await adminAuthApi.getProfile();
      const adminUser = response?.user || response?.admin;

      if (response.success && adminUser?.role === 'admin') {
        setIsAuthenticated(true);
        setAdminData(adminUser);
      } else {
        // If API fails but test mode is on, allow access
        if (allowTestMode) {
          setIsAuthenticated(true);
          setAdminData({ fullname: 'Test Admin', email: 'test@admin.com', role: 'admin' });
        } else {
          localStorage.removeItem('authToken');
          router.push('/admin/login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      
      // For initial testing - allow access even if API fails
      const allowTestMode = true; // Set to false in production
      
      if (allowTestMode) {
        setIsAuthenticated(true);
        setAdminData({ fullname: 'Test Admin', email: 'test@admin.com', role: 'admin' });
      } else {
        localStorage.removeItem('authToken');
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/plans', label: 'Plans', icon: '💰' },
    { href: '/admin/demo-content', label: 'Demo Content', icon: '🖼️' },
    { href: '/admin/portfolio', label: 'Portfolio', icon: '🎨' },
    { href: '/admin/team', label: 'Team', icon: '👥' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/meeting-requests', label: 'Meeting Requests', icon: '📞' },
    // { href: '/admin/meetings', label: 'Meetings', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Ecom Ads Management</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-900">{adminData?.fullname || 'Admin'}</p>
            <p className="text-xs text-gray-500">{adminData?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

