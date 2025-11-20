'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminPlanApi } from '../../../lib/adminApi';

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video'

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await adminPlanApi.getAllPlans();
      if (response.success) {
        setPlans(response.plans || []);
      } else {
        setPlans([]);
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - showing empty state');
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    router.push('/admin/plans/create');
  };

  const handleEdit = (plan) => {
    router.push(`/admin/plans/edit/${plan._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      const response = await adminPlanApi.deletePlan(id);
      if (response.success) {
        fetchPlans();
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - test mode');
      // In test mode, just remove from local state
      setPlans(plans.filter(p => p._id !== id));
    }
  };


  const filteredPlans = filterType === 'all' 
    ? plans 
    : plans.filter(plan => plan.planType === filterType);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Plans</h1>
          <p className="text-gray-600 mt-1">Create and manage pricing plans for image and video ads</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          + Create New Plan
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Plans
        </button>
        <button
          onClick={() => setFilterType('image')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'image'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Image Plans
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'video'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Video Plans
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Plans List */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No plans found</p>
          <button
            onClick={handleCreate}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white p-6 rounded-lg shadow-md border-2 ${
                plan.isPopular ? 'border-purple-500' : 'border-gray-200'
              }`}
            >
              {plan.tag && (
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${plan.tagColor || 'bg-purple-600'} text-white`}>
                  {plan.tag}
                </div>
              )}
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.planName}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    plan.planType === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {plan.planType}
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-600">₹{plan.price?.toLocaleString('en-IN')}</div>
                {plan.pricePer && (
                  <div className="text-sm text-gray-600">{plan.pricePer}</div>
                )}
                {plan.total && (
                  <div className="text-lg font-semibold text-gray-900 mt-1">{plan.total}</div>
                )}
              </div>

              {plan.description && (
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
              )}

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Features:</div>
                <ul className="space-y-1">
                  {plan.features?.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features?.length > 3 && (
                    <li className="text-sm text-gray-500">+{plan.features.length - 3} more</li>
                  )}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    plan.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {plan.isPopular && (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

