import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, App } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FolderOpenOutlined, DatabaseOutlined, LogoutOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api';
import { User, ApiResponse } from '../../types';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

export const TeacherLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, setAuth, logout } = useAuthStore();
  const { message } = App.useApp();

  // Hàm lấy thông tin hồ sơ mới nhất (Live Data)
  const fetchLatestProfile = async () => {
    if (!token) return;
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      if (response.data.success && response.data.data) {
        // Cập nhật vào Zustand Store và localStorage (persist middleware tự động xử lý)
        setAuth(response.data.data, token);
      }
    } catch (error) {
      console.error('Failed to fetch latest profile:', error);
      // Nếu lỗi 401 (Unauthorized) thì xử lý ở api interceptor đã làm rồi
    }
  };

  // Tự động cập nhật dữ liệu khi F5 hoặc chuyển trang chính
  useEffect(() => {
    fetchLatestProfile();
  }, [location.pathname]); // Cập nhật khi đổi route

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    
    logout();
    message.success('Đăng xuất thành công!');
    navigate('/', { replace: true });
  };

  const menuItems = [
    { 
      key: '/teacher/dashboard', 
      icon: <HomeOutlined />, 
      label: 'Bảng điều khiển', 
      onClick: () => navigate('/teacher/dashboard') 
    },
    { 
      key: '/teacher/classes', 
      icon: <FolderOpenOutlined />, 
      label: 'Quản lý lớp học', 
      onClick: () => navigate('/teacher/classes') 
    },
    { 
      key: '/teacher/question-bank', 
      icon: <DatabaseOutlined />, 
      label: 'Ngân hàng câu hỏi', 
      onClick: () => navigate('/teacher/question-bank') 
    },
    { 
      key: '/teacher/type-configs', 
      icon: <SettingOutlined />, 
      label: 'Type & OptionType', 
      onClick: () => navigate('/teacher/type-configs') 
    }
  ];

  return (
    <Layout className="min-h-screen bg-[#f0f2f5]">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={250}
        className="border-r border-gray-150 shadow-sm"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000
        }}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
              <Text className="font-bold text-orange-600 text-lg">Giáo Viên Portal</Text>
            </div>
          )}
          <div 
            className="cursor-pointer text-gray-400 hover:text-orange-500 transition-colors mx-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="h-[calc(100vh-140px)] border-none"
        />

        <div className="p-4 border-t border-gray-100 absolute bottom-0 w-full bg-white">
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            className="flex items-center justify-center h-10 rounded-lg font-medium"
          >
            {!collapsed && 'Đăng xuất'}
          </Button>
        </div>
      </Sider>

      {/* Main Layout Area */}
      <Layout 
        className="bg-transparent" 
        style={{ 
          marginLeft: collapsed ? 80 : 250, 
          transition: 'margin-left 0.2s',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        {/* Header */}
        <Header className="bg-white h-16 px-6 flex items-center justify-between border-b border-gray-100 sticky top-0 z-999 shadow-sm">
          <Text className="text-gray-500 font-medium">Xin chào, {user?.full_name || 'Giáo viên'}</Text>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/teacher/profile')}
          >
            <UserOutlined className="text-gray-400 bg-gray-100 p-2 rounded-full text-base" />
            <Text className="font-semibold text-gray-700">{user?.full_name}</Text>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 md:p-8">
          <Outlet />
        </Content>
      </Layout>
      
      <style>{`
        .ant-menu-item-selected {
          background-color: #fff7ed !important;
          color: #ea580c !important;
        }
        .ant-menu-item-selected .anticon {
          color: #ea580c !important;
        }
      `}</style>
    </Layout>
  );
};

export default TeacherLayout;
