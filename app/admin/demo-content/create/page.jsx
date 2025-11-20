'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminDemoContentApi } from '../../../../lib/adminApi';

export default function CreateDemoContentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    contentType: 'image',
    title: '',
    description: '',
    displayOrder: 0,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({
    imageFile: null,
    videoFile: null,
    thumbnailFile: null,
  });
  const [previews, setPreviews] = useState({
    imageFile: '',
    videoFile: '',
    thumbnailFile: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({
      ...prev,
      [field]: previewUrl,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (formData.contentType === 'image' && !selectedFiles.imageFile) {
        setError('Please upload an image file');
        setIsLoading(false);
        return;
      }

      if (formData.contentType === 'video' && !selectedFiles.videoFile) {
        setError('Please upload a video file');
        setIsLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append('contentType', formData.contentType);
      payload.append('title', formData.title);
      payload.append('description', formData.description || '');
      payload.append('displayOrder', String(formData.displayOrder || 0));
      payload.append('isActive', String(formData.isActive));

      if (selectedFiles.imageFile) {
        payload.append('imageFile', selectedFiles.imageFile);
      }
      if (selectedFiles.videoFile) {
        payload.append('videoFile', selectedFiles.videoFile);
      }
      if (selectedFiles.thumbnailFile) {
        payload.append('thumbnailFile', selectedFiles.thumbnailFile);
      }

      const response = await adminDemoContentApi.create(payload);

      if (response.success) {
        router.push('/admin/demo-content');
      } else {
        setError(response.message || 'Failed to create demo content');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create demo content');
      console.error('Error creating demo content:', error);
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
          Back to Demo Content
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add Demo Content</h1>
        <p className="text-gray-600 mt-1">Add new demo image or video content</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type *
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* Title */}
            <div>
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
                placeholder="e.g., Beauty Brand Ads"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Content description..."
              />
            </div>

            {/* Image Upload */}
            {formData.contentType === 'image' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'imageFile')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {previews.imageFile && (
                  <div className="mt-4">
                    <img src={previews.imageFile} alt="Preview" className="max-w-xs rounded-lg" />
                  </div>
                )}
              </div>
            )}

            {/* Video Upload */}
            {formData.contentType === 'video' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video *
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange(e, 'videoFile')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {previews.videoFile && (
                    <div className="mt-4">
                      <video src={previews.videoFile} controls className="max-w-xs rounded-lg" />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'thumbnailFile')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {previews.thumbnailFile && (
                    <div className="mt-4">
                      <img src={previews.thumbnailFile} alt="Thumbnail" className="max-w-xs rounded-lg" />
                    </div>
                  )}
                </div>
              </>
            )}

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

            {/* Active Status */}
            <div className="flex items-center gap-2 pt-6">
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
              {isLoading ? 'Creating...' : 'Create Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

