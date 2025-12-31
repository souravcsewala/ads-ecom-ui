'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminPortfolioApi } from '../../../lib/adminApi';

export default function PortfolioPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const response = await adminPortfolioApi.getAll();
      if (response.success) {
        setPortfolios(response.portfolios || []);
      } else {
        setPortfolios([]);
      }
    } catch (error) {
      console.log('No backend connection - showing empty state');
      setPortfolios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    router.push('/admin/portfolio/create');
  };

  const handleEdit = (portfolio) => {
    router.push(`/admin/portfolio/edit/${portfolio._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this portfolio item? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminPortfolioApi.delete(id);
      if (response.success) {
        await fetchPortfolios();
      } else {
        alert(response.message || 'Failed to delete portfolio item');
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.log('No backend connection - test mode');
        setPortfolios(portfolios.filter(p => p._id !== id));
      } else {
        alert(error.response?.data?.message || 'Failed to delete portfolio item. Please try again.');
      }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Portfolio</h1>
          <p className="text-gray-600 mt-1">Manage portfolio items for the Performance-Driven Designs section</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          + Add Portfolio Item
        </button>
      </div>

      {/* Portfolio List */}
      {portfolios.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No portfolio items found</p>
          <button
            onClick={handleCreate}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Your First Portfolio Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <div
              key={portfolio._id}
              className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200"
            >
              <div className="mb-4">
                {portfolio.imageUrl ? (
                  <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer">
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      onClick={() =>
                        setZoomImage({
                          url: portfolio.imageUrl,
                          title: portfolio.title,
                          category: portfolio.category,
                        })
                      }
                    />
                    {/* Zoom Icon Overlay */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/60 backdrop-blur-sm rounded-full p-2.5">
                        <svg 
                          className="w-5 h-5 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/5] rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">🖼️</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{portfolio.title}</h3>
                </div>
                {portfolio.category && (
                  <p className="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-2">
                    {portfolio.category}
                  </p>
                )}
                {portfolio.linkUrl && (
                  <a
                    href={portfolio.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    View Link
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  portfolio.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {portfolio.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(portfolio)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio._id)}
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

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 z-10"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-black flex items-center justify-center p-6">
              <img
                src={zoomImage.url}
                alt={zoomImage.title}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-semibold text-gray-900">{zoomImage.title}</h3>
              {zoomImage.category && (
                <p className="mt-2 text-purple-600 font-semibold uppercase tracking-wider text-sm">{zoomImage.category}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

