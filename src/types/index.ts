/**
 * Interface đại diện cho người dùng trong hệ thống
 * Khớp 100% với bảng 'users' thực tế trên TiDB
 */
export interface User {
  id: number;
  user_code: string | null;
  full_name: string;
  account_type: string | null;
  level: string | null;
  province_id: number | null;
  ward_id: number | null;
  school_id: number | null;
  email: string;
  password: string | null;
  phone: string | null;
  status: number; // tinyint(1) trong SQL trả về number (0 hoặc 1)
  role: string;
  avatar_url?: string | null;
  created_at: string; // Ở Frontend thường là string ISO
  deleted_at: string | null;
}

/**
 * Interface cho đối tượng Sách
 * Khớp 100% với bảng 'books' thực tế trên TiDB
 */
export interface Book {
  id: number;
  title: string;
  author: string | null;
  description: string | null;
  price: string | number; // Decimal trong SQL thường trả về string
  category_id: number | null;
  created_at: string;
}

/**
 * Interface cho Danh mục
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * Interface cho Tỉnh/Thành phố
 */
export interface Province {
  id: number;
  name: string;
}

/**
 * Interface cho Phường/Xã
 */
export interface Ward {
  id: number;
  province_id: number;
  name: string;
}

/**
 * Interface cho Trường học
 */
export interface School {
  id: number;
  name: string;
  province_id: number | null;
}

/**
 * Interface cho Nhật ký hoạt động
 */
export interface ActivityLog {
  id: number;
  user_id: number | null;
  user_email: string | null;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  target_user_id: number | null;
  description: string;
  old_values: string | null; // DB trả về string JSON
  new_values: string | null;
  ip_address: string | null;
  created_at: string;
}

/**
 * Interface cho phân trang log
 */
export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Cấu trúc phản hồi chuẩn từ API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: PaginationData;
}

/**
 * Interface cho bộ lọc người dùng
 */
export interface UserFilterState {
  role?: string;
  level?: string;
  province?: number | string;
  district?: number | string;
  school?: string;
  phone?: string;
  email?: string;
}

/**
 * Dữ liệu đăng nhập
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Dữ liệu trả về khi đăng nhập thành công
 */
export interface LoginResponse {
  accessToken: string;
  user: User;
}
