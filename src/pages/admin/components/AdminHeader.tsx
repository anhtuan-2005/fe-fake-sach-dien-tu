import React from 'react';
import { Layout, Breadcrumb, Badge, Avatar, Space, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined, BellOutlined, UserOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import api from '../../../api';

const { Header } = Layout;

interface AdminHeaderProps {
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  isMobile?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, setCollapsed, isMobile }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    logout();
    navigate('/');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/admin/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="bg-transparent px-4 sm:px-6 flex items-center justify-between h-16">
      <div className="flex items-center gap-4">
        {isMobile && (
          <div 
            className="text-white text-xl cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setCollapsed?.(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        )}
        <Breadcrumb
          items={[
            {
              href: '/admin',
              title: <HomeOutlined />,
            },
            {
              title: 'Administration',
            },
          ]}
          className="text-white opacity-90 hidden xs:flex"
        />
      </div>

      <Space size={24} className="flex items-center">
        <Badge count={9} size="small" offset={[-2, 4]} className="cursor-pointer">
          <div className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <BellOutlined className="text-white text-lg flex" />
          </div>
        </Badge>
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div className="flex items-center gap-3 cursor-pointer group">
            <Avatar 
              size="large" 
              src={user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Testbank"}
              icon={<UserOutlined />}
              className="border-2 border-white/50 group-hover:border-white transition-all"
            />
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-white font-semibold group-hover:opacity-80 transition-opacity">
                {user?.full_name || 'Admin'}
              </span>
              <span className="text-white/70 text-[10px] uppercase tracking-wider">
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;
