import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import useAuthStore from './store/useAuthStore';
import { ApiResponse } from './types';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Quan trọng: Cho phép gửi cookie (refreshToken)
});

// Axios Request Interceptor: Tự động đính kèm token vào header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Biến để tránh gọi refresh token nhiều lần cùng lúc
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Axios Response Interceptor: Xử lý lỗi token hết hạn (401)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra lỗi 401 và mã lỗi TOKEN_EXPIRED từ Backend
    const isTokenExpired = error.response && 
                          error.response.status === 401 && 
                          error.response.data?.message === 'TOKEN_EXPIRED';

    // Nếu lỗi 401 (Hết hạn Access Token) và chưa từng thử retry
    if (isTokenExpired && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh rồi thì đẩy request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API refresh token
        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${api.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Trích xuất accessToken từ response.data.data theo chuẩn ApiResponse mới
        const { accessToken } = response.data.data || {};
        
        if (!accessToken) {
          throw new Error('Refresh token failed - No access token received');
        }
        
        // Cập nhật Zustand Store
        useAuthStore.getState().setAuth(useAuthStore.getState().user, accessToken);
        
        // Xử lý hàng đợi
        processQueue(null, accessToken);
        
        // Thực hiện lại request ban đầu với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng lỗi (ví dụ Refresh Token hết hạn)
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác hoặc refresh thất bại
    return Promise.reject(error);
  }
);

export default api;
