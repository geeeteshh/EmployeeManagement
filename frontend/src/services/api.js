const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-expired'));
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
};

export const api = {
  auth: {
    login: async (email, password) => {
      return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    register: async (name, email, password) => {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    },
  },
  employees: {
    getAll: async (searchQuery = '') => {
      const endpoint = searchQuery 
        ? `/employees?search=${encodeURIComponent(searchQuery)}`
        : '/employees';
      return request(endpoint, {
        method: 'GET',
      });
    },
    create: async (employeeData) => {
      return request('/employees', {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
    },
    update: async (id, employeeData) => {
      return request(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(employeeData),
      });
    },
    delete: async (id) => {
      return request(`/employees/${id}`, {
        method: 'DELETE',
      });
    },
  },
};
