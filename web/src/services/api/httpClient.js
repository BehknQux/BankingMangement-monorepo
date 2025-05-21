import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => {
    if (response.config && response.config.responseType === 'blob') {
      return response;
    }
    if (response.data?.message) {
      return {
        ...response,
        data: {
          ...response.data,
          successMessage: response.data.message
        }
      };
    }
    return {
      ...response,
      data: {
        ...response.data,
        successMessage: 'Operation successful'
      }
    };
  },
  async (error) => {
    const defaultError = 'An error occurred';
    const errorMessage = error.response?.data?.message || defaultError;
    return Promise.reject(new Error(errorMessage));
  }
);

export default httpClient;