import React from 'react';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import useAuthStore from '../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Đợi Zustand khôi phục dữ liệu từ localStorage (Hydration)
  React.useEffect(() => {
    // Với Zustand persist, chúng ta có thể kiểm tra xem store đã hydrate chưa
    // Nếu không muốn dùng API phức tạp, ta có thể dùng một useEffect đơn giản 
    // vì useEffect chỉ chạy sau khi component đã mount (và thường là sau hydration)
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Hoặc một loading spinner
  }

  // 1. Nếu chưa đăng nhập -> Chuyển hướng về trang chủ
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Kiểm tra vai trò của người dùng
  const userRole = user?.role?.toLowerCase() || '';

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(userRole))) {
    // Nếu không có quyền -> Hiển thị màn hình 403 của Ant Design
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Result
          status="403"
          title={<span className="text-4xl font-extrabold text-blue-900">403</span>}
          subTitle={<span className="text-lg text-gray-500 font-medium">Bạn không có quyền truy cập trang này.</span>}
          extra={
            <Button 
              type="primary" 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg h-10 px-6 font-semibold"
            >
              Về trang chủ
            </Button>
          }
          className="bg-white p-12 rounded-2xl shadow-sm max-w-[500px] w-full border border-gray-100"
        />
      </div>
    );
  }

  // 3. Nếu hợp lệ -> Render trang con
  return <>{children}</>;
};

export default ProtectedRoute;
