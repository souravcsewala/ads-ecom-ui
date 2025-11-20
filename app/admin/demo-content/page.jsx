'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminDemoContentApi } from '../../../lib/adminApi';

export default function DemoContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all', 'image', 'video'
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await adminDemoContentApi.getAll();
      if (response.success) {
        setContents(response.contents || []);
      } else {
        setContents([]);
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - showing empty state');
      setContents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    router.push('/admin/demo-content/create');
  };

  const handleEdit = (content) => {
    router.push(`/admin/demo-content/edit/${content._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this demo content? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await adminDemoContentApi.delete(id);
      if (response.success) {
        // Refresh the list after successful deletion
        await fetchContents();
      } else {
        alert(response.message || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      // For test mode - silently handle network errors
      if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
        console.log('No backend connection - test mode');
        // In test mode, just remove from local state
        setContents(contents.filter(c => c._id !== id));
      } else {
        alert(error.response?.data?.message || 'Failed to delete content. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContents = filterType === 'all' 
    ? contents 
    : contents.filter(content => content.contentType === filterType);

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
          <h1 className="text-3xl font-bold text-gray-900">Manage Demo Content</h1>
          <p className="text-gray-600 mt-1">Manage demo images and videos for the frontend</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          + Add Demo Content
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
          All Content
        </button>
        <button
          onClick={() => setFilterType('image')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'image'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Images
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterType === 'video'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Videos
        </button>
      </div>

      {/* Content List */}
      {filteredContents.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No demo content found</p>
          <button
            onClick={handleCreate}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Your First Demo Content
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContents.map((content) => (
            <div
              key={content._id}
              className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200"
            >
              <div className="mb-4">
                {content.contentType === 'video' && content.videoUrl ? (
                  <div className="aspect-[9/16] rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={content.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={content.thumbnailUrl}
                    />
                  </div>
                ) : content.imageUrl ? (
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer">
                    <img
                      src={content.imageUrl}
                      alt={content.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      onClick={() =>
                        setZoomImage({
                          url: content.imageUrl,
                          title: content.title,
                          description: content.description,
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
                  <div className={`${content.contentType === 'video' ? 'aspect-[9/16]' : 'aspect-square'} rounded-lg bg-gray-200 flex items-center justify-center`}>
                    <span className="text-gray-400 text-4xl">
                      {content.contentType === 'video' ? '🎥' : '🖼️'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{content.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    content.contentType === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {content.contentType}
                  </span>
                </div>
                {content.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">{content.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  content.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {content.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(content._id)}
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
              {zoomImage.description && (
                <p className="mt-2 text-gray-600">{zoomImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

