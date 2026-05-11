import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios Request Interceptor: Tự động đính kèm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor: Xử lý lỗi token hết hạn (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Nếu token hết hạn, xóa localStorage và có thể chuyển hướng về trang chủ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;
