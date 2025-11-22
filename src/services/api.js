// Use the current host's IP or localhost for API calls
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api'
  : `http://${window.location.hostname}:8000/api`;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
};

// ============= AUTH API =============

export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return await response.json();
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// ============= APPLICATION API =============

export const applicationAPI = {
  create: async (applicationData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/applications`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create application');
    }

    return await response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Application not found');
    }

    return await response.json();
  },

  getMyApplications: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/applications`);
    
    if (!response.ok) {
      throw new Error('Failed to get applications');
    }

    return await response.json();
  },

  update: async (id, updateData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update application');
    }

    return await response.json();
  },

  delete: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/applications/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete application');
    }

    return await response.json();
  }
};

// ============= OFFICIAL/OFFICE API =============

export const officeAPI = {
  getApplications: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/office/applications`);
    
    if (!response.ok) {
      throw new Error('Failed to get office applications');
    }

    return await response.json();
  },

  getStats: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/office/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to get office stats');
    }

    return await response.json();
  },

  getSubordinates: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/hierarchy/subordinates`);
    
    if (!response.ok) {
      throw new Error('Failed to get subordinate offices');
    }

    return await response.json();
  },

  getHierarchyStats: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/monitor/hierarchy-stats`);
    
    if (!response.ok) {
      throw new Error('Failed to get hierarchy stats');
    }

    return await response.json();
  },

  sendMessage: async (messageData) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to send message');
    }

    return await response.json();
  },

  getReceivedMessages: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages/received`);
    
    if (!response.ok) {
      throw new Error('Failed to get messages');
    }

    return await response.json();
  },

  getSentMessages: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages/sent`);
    
    if (!response.ok) {
      throw new Error('Failed to get sent messages');
    }

    return await response.json();
  },

  markMessageRead: async (messageId) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }

    return await response.json();
  },

  getAllOfficials: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/officials`);
    
    if (!response.ok) {
      throw new Error('Failed to get officials list');
    }

    return await response.json();
  }
};

