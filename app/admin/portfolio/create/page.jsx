'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminPortfolioApi } from '../../../../lib/adminApi';

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    linkUrl: '',
    category: '',
    displayOrder: 0,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!selectedFile) {
        setError('Please upload an image file');
        setIsLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('linkUrl', formData.linkUrl || '');
      payload.append('category', formData.category || '');
      payload.append('displayOrder', String(formData.displayOrder || 0));
      payload.append('isActive', String(formData.isActive));
      payload.append('imageFile', selectedFile);

      const response = await adminPortfolioApi.create(payload);

      if (response.success) {
        router.push('/admin/portfolio');
      } else {
        setError(response.message || 'Failed to create portfolio item');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create portfolio item');
      console.error('Error creating portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Portfolio
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add Portfolio Item</h1>
        <p className="text-gray-600 mt-1">Add new portfolio item for Performance-Driven Designs section</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., E-commerce Brand Identity"
              />
            </div>

            {/* Link URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <input
                type="url"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://www.figma.com/community/file/..."
              />
              <p className="text-xs text-gray-500 mt-1">Optional: Link to view the design (e.g., Figma, Behance, etc.)</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Branding, Ads Design, Web Design"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: Category tag for display</p>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="aspect-[4/5] max-w-xs rounded-lg overflow-hidden border border-gray-300">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            {/* Active Status */}
            <div className="md:col-span-2 flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Portfolio Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

