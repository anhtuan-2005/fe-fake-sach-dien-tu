import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, App } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ReadOutlined, FormOutlined, LogoutOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';
import api from '../../api';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

export const StudentLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { message } = App.useApp();

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
      key: '/student/home', 
      icon: <HomeOutlined />, 
      label: 'Trang chủ học sinh', 
      onClick: () => navigate('/student/home') 
    },
    { 
      key: '/student/classes', 
      icon: <BookOutlined />, 
      label: 'Lớp học của tôi', 
      onClick: () => navigate('/student/classes') 
    },
    { 
      key: '/student/books', 
      icon: <ReadOutlined />, 
      label: 'Xem sách', 
      onClick: () => navigate('/student/books') 
    },
    { 
      key: '/student/exercises', 
      icon: <FormOutlined />, 
      label: 'Làm bài tập', 
      onClick: () => navigate('/student/exercises') 
    }
  ];

  const getSelectedKey = () => {
    if (location.pathname.startsWith('/student/classes')) {
      return '/student/classes';
    }
    return location.pathname;
  };

  return (
    <Layout className="min-h-screen bg-[#f9fafb]">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={250}
        className="border-r border-gray-100 shadow-sm"
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
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-55">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <Text className="font-bold text-emerald-600 text-lg">Học Sinh Portal</Text>
            </div>
          )}
          <div 
            className="cursor-pointer text-gray-400 hover:text-emerald-500 transition-colors mx-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
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
          <Text className="text-gray-500 font-medium">Chào mừng, {user?.full_name || 'Học sinh'}</Text>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/student/profile')}
          >
            <UserOutlined className="text-gray-400 bg-gray-50 p-2 rounded-full text-base" />
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
          background-color: #ecfdf5 !important;
          color: #059669 !important;
        }
        .ant-menu-item-selected .anticon {
          color: #059669 !important;
        }
      `}</style>
    </Layout>
  );
};

export default StudentLayout;
