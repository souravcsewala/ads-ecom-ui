// Admin API utility functions
import axios from 'axios';
import { prodServerUrl } from '../global/server';

// Create axios instance for admin API calls
const adminApiClient = axios.create({
  baseURL: `${prodServerUrl}/api`,
});

// Helper to get auth token from localStorage or cookies
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken') || '';
  }
  return '';
};

// Add request interceptor to include token
adminApiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    
    // If data is FormData, let axios set Content-Type automatically (with boundary)
    // Don't override Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    console.log('📤 Admin API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data instanceof FormData ? '[FormData]' : config.data,
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Admin API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses and errors
adminApiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Admin API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url,
      method: response.config?.method?.toUpperCase(),
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error('❌ Admin API Response Error:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Request URL:', error.config?.url);
    console.error('Request method:', error.config?.method?.toUpperCase());
    console.error('Request baseURL:', error.config?.baseURL);
    console.error('Full request URL:', `${error.config?.baseURL}${error.config?.url}`);
    console.error('Request headers:', error.config?.headers);
    console.error('Request data:', error.config?.data);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response statusText:', error.response.statusText);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    console.error('Full error object:', error);
    
    return Promise.reject(error);
  }
);

// Admin Plan APIs
export const adminPlanApi = {
  // Get all plans (including inactive)
  getAllPlans: async () => {
    const response = await adminApiClient.get('/plans');
    return response.data;
  },

  // Get plan by ID
  getPlanById: async (id) => {
    const response = await adminApiClient.get(`/plans/${id}`);
    return response.data;
  },

  // Create plan
  createPlan: async (planData) => {
    const response = await adminApiClient.post('/plans/admin/create', planData);
    return response.data;
  },

  // Update plan
  updatePlan: async (id, planData) => {
    const response = await adminApiClient.put(`/plans/admin/${id}`, planData);
    return response.data;
  },

  // Delete plan (soft delete)
  deletePlan: async (id) => {
    const response = await adminApiClient.delete(`/plans/admin/${id}`);
    return response.data;
  },
};

// Admin Auth APIs
export const adminAuthApi = {
  // Admin login
  login: async (email, password) => {
    const response = await adminApiClient.post('/admin/login', {
      email,
      password,
    });
    return response.data;
  },

  // Get admin profile
  getProfile: async () => {
    const response = await adminApiClient.get('/admin/profile');
    return response.data;
  },
};

// Admin Dashboard APIs
export const adminDashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await adminApiClient.get('/admin/dashboard/stats');
    return response.data;
  },
};

// Admin Demo Content APIs
export const adminDemoContentApi = {
  getAll: async () => {
    const response = await adminApiClient.get('/demo-content');
    return response.data;
  },

  getById: async (id) => {
    const response = await adminApiClient.get(`/demo-content/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await adminApiClient.post('/demo-content/admin/create', data);
    return response.data;
  },

  update: async (id, data) => {
    // Axios automatically handles FormData and sets Content-Type with boundary
    const response = await adminApiClient.put(`/demo-content/admin/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await adminApiClient.delete(`/demo-content/admin/${id}`);
    return response.data;
  },
};

// Admin Team APIs
export const adminTeamApi = {
  getAll: async () => {
    const response = await adminApiClient.get('/team');
    return response.data;
  },

  getById: async (id) => {
    const response = await adminApiClient.get(`/team/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await adminApiClient.post('/team/admin/create', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await adminApiClient.put(`/team/admin/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await adminApiClient.delete(`/team/admin/${id}`);
    return response.data;
  },
};

// Admin Order APIs
export const adminOrderApi = {
  getAll: async () => {
    const response = await adminApiClient.get('/orders/admin/all');
    return response.data;
  },

  getById: async (id) => {
    const response = await adminApiClient.get(`/orders/admin/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await adminApiClient.put(`/orders/admin/${id}/status`, { status });
    return response.data;
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    const response = await adminApiClient.put(`/orders/admin/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  delete: async (id) => {
    const response = await adminApiClient.delete(`/orders/admin/${id}`);
    return response.data;
  },
};

// Admin Meeting APIs
export const adminMeetingApi = {
  getAll: async () => {
    const response = await adminApiClient.get('/meetings');
    return response.data;
  },

  getUpcoming: async () => {
    const response = await adminApiClient.get('/meetings/upcoming');
    return response.data;
  },

  getPast: async () => {
    const response = await adminApiClient.get('/meetings/past');
    return response.data;
  },

  getById: async (id) => {
    const response = await adminApiClient.get(`/meetings/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await adminApiClient.post('/meetings/create', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await adminApiClient.put(`/meetings/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await adminApiClient.put(`/meetings/${id}/status`, { status });
    return response.data;
  },

  addNotes: async (id, notes) => {
    const response = await adminApiClient.post(`/meetings/${id}/notes`, { notes });
    return response.data;
  },

  delete: async (id) => {
    const response = await adminApiClient.delete(`/meetings/${id}`);
    return response.data;
  },
};

export const adminMeetingRequestApi = {
  getAll: async () => {
    const response = await adminApiClient.get('/meeting-requests/admin/all');
    return response.data;
  },
  getById: async (id) => {
    const response = await adminApiClient.get(`/meeting-requests/admin/${id}`);
    return response.data;
  },
  updateStatus: async (id, status, adminNotes) => {
    const response = await adminApiClient.put(`/meeting-requests/admin/${id}/status`, { status, adminNotes });
    return response.data;
  },
  delete: async (id) => {
    const response = await adminApiClient.delete(`/meeting-requests/admin/${id}`);
    return response.data;
  },
};

// Admin Portfolio APIs
export const adminPortfolioApi = {
  getAll: async () => {
    const response = await adminApiClient.get('/portfolio');
    return response.data;
  },
  getById: async (id) => {
    const response = await adminApiClient.get(`/portfolio/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await adminApiClient.post('/portfolio/admin/create', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await adminApiClient.put(`/portfolio/admin/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await adminApiClient.delete(`/portfolio/admin/${id}`);
    return response.data;
  },
};

