import axios from 'axios';

// Configure axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:4201/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to avoid long waiting periods
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      console.error(`API Error: ${error.response.status} ${error.config.url}`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Flow related API calls
export const getFlows = async () => {
  try {
    const response = await api.get('/flows');
    return response.data;
  } catch (error) {
    console.error('Error fetching flows:', error);
    throw error;
  }
};

export const getFlowById = async (id: string) => {
  try {
    const response = await api.get(`/flows/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching flow with id ${id}:`, error);
    throw error;
  }
};

export const createFlow = async (flowData: any) => {
  try {
    const response = await api.post('/flows', flowData);
    return response.data;
  } catch (error) {
    console.error('Error creating flow:', error);
    throw error;
  }
};

export const updateFlow = async (id: string, flowData: any) => {
  try {
    const response = await api.put(`/flows/${id}`, flowData);
    return response.data;
  } catch (error) {
    console.error(`Error updating flow with id ${id}:`, error);
    throw error;
  }
};

export const deleteFlow = async (id: string) => {
  try {
    const response = await api.delete(`/flows/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting flow with id ${id}:`, error);
    throw error;
  }
};

export default api; 