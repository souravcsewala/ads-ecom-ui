// API utility functions for backend communication
import axios from 'axios';
import { prodServerUrl } from '../global/server';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: `${prodServerUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  try {
    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
    };

    const response = await apiClient.get(endpoint, config);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'API request failed');
    }
    console.error('API Error:', error);
    throw error;
  }
}

async function getPresignedUrl(token, payload) {
  const response = await apiClient.post('/upload/presigned-url', payload, {
    headers: {
      'x-auth-token': token,
    },
  });
  return response.data;
}

async function uploadFileWithPresignedUrl(file, token, folder) {
  if (!file) {
    throw new Error('File is required for upload');
  }

  const fileType = file.type || 'application/octet-stream';
  const presignData = await getPresignedUrl(token, {
    fileName: file.name,
    fileType,
    folder,
  });

  const { uploadUrl, fileUrl, uploadHeaders } = presignData || {};

  if (!uploadUrl || !fileUrl) {
    throw new Error('Failed to get pre-signed URL for upload');
  }

  await axios.put(uploadUrl, file, {
    headers: {
      ...(uploadHeaders || {}),
      'Content-Type': fileType,
    },
  });

  return {
    success: true,
    fileUrl,
    key: presignData.key,
  };
}

// Helper function for POST/PUT/DELETE requests
async function requestAPI(method, endpoint, data = null, options = {}) {
  try {
    const config = {
      ...options,
      headers: {
        ...options.headers,
      },
    };

    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    return response.data;
  } catch (error) {
    // Preserve the original error structure so components can access error.response
    if (error.response) {
      // Create a new error but preserve the response
      const errorMessage = error.response.data?.message || error.response.data?.error || 'API request failed';
      const apiError = new Error(errorMessage);
      apiError.response = error.response;
      apiError.config = error.config;
      
      // Log error details in a way that's readable
      const errorDetails = {
        message: errorMessage,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
      };
      console.error('API Error:', JSON.stringify(errorDetails, null, 2));
      throw apiError;
    }
    console.error('API Error (no response):', {
      message: error.message,
      code: error.code,
      config: error.config ? {
        url: `${error.config.baseURL}${error.config.url}`,
        method: error.config.method,
      } : null,
    });
    throw error;
  }
}

// Public APIs (no auth required)
export const api = {
  // Plans
  getPlans: async (planType = null) => {
    const query = planType ? `?planType=${planType}` : '';
    return fetchAPI(`/plans${query}`);
  },

  // Demo Content
  getDemoContent: async (contentType = null) => {
    const query = contentType ? `?contentType=${contentType}` : '';
    return fetchAPI(`/demo-content${query}`);
  },

  // Team Members
  getTeamMembers: async () => {
    return fetchAPI('/team');
  },

  // Portfolio (Public - for Performance-Driven Designs section)
  getPortfolio: async () => {
    return fetchAPI('/portfolio');
  },

  // Meeting Requests (Public - no auth required)
  createMeetingRequest: async (data) => {
    return requestAPI('POST', '/meeting-requests/create', data);
  },
};

// Authenticated APIs (require token)
export const authApi = {
  // Auth
  register: async (data) => {
    return requestAPI('POST', '/auth/register', data);
  },

  login: async (data) => {
    return requestAPI('POST', '/auth/login', data);
  },

  getProfile: async (token) => {
    return fetchAPI('/auth/me', {
      headers: { 'x-auth-token': token },
    });
  },

  // Orders
  createOrder: async (data, token = null) => {
    const headers = {};
    if (token) {
      headers['x-auth-token'] = token;
    }
    return requestAPI('POST', '/orders/create', data, {
      headers,
    });
  },

  getMyOrders: async (token) => {
    return fetchAPI('/orders/my-orders', {
      headers: { 'x-auth-token': token },
    });
  },

  // File Upload
  uploadFile: async (file, token, folder = 'user-uploads') => {
    try {
      return await uploadFileWithPresignedUrl(file, token, folder);
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  },

  uploadBrandAssets: async (file, token) => {
    try {
      const userFolder = 'brand-assets';
      return await uploadFileWithPresignedUrl(file, token, userFolder);
    } catch (error) {
      console.error('Brand Asset Upload Error:', error);
      throw error;
    }
  },
};

