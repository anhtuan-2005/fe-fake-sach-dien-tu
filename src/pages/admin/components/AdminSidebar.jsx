import React from 'react';
import { Layout, Menu, Typography, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import {
  HomeOutlined,
  BellOutlined,
  BookOutlined,
  ReadOutlined,
  ToolOutlined,
  TeamOutlined,
  PlaySquareOutlined,
  QuestionCircleOutlined,
  BankOutlined,
  FolderOpenOutlined,
  DatabaseOutlined,
  SettingOutlined,
  MailOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // Gọi API logout để xóa cookie refreshToken ở backend
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    logout();
    // Xóa thêm localStorage cũ để dọn dẹp (nếu còn)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Đăng xuất thành công');
    navigate('/');
  };

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ' },
    { key: 'notif', icon: <BellOutlined />, label: 'Thông báo' },
    { key: 'offline', icon: <BookOutlined />, label: 'Sách điện tử (offline)' },
    { key: 'elearning', icon: <ReadOutlined />, label: 'Bài giảng E-learning' },
    { key: 'tools', icon: <ToolOutlined />, label: 'Công cụ' },
    { key: 'class', icon: <TeamOutlined />, label: 'Lớp học' },
    { key: 'game', icon: <PlaySquareOutlined />, label: 'Education Game' },
    { key: 'guide', icon: <QuestionCircleOutlined />, label: 'Hướng dẫn sử dụng' },
    { type: 'divider' },
    { 
      key: 'admin-group', 
      label: !collapsed ? 'ADMINISTRATORS' : '', 
      type: 'group',
      children: [
        { key: 'library', icon: <BankOutlined />, label: 'Thư viện' },
        { key: 'class-mgmt', icon: <FolderOpenOutlined />, label: 'Quản lý lớp học' },
        { key: 'user-mgmt', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
        { key: 'q-bank', icon: <DatabaseOutlined />, label: 'Ngân hàng câu hỏi' },
        { key: 'type-opt', icon: <SettingOutlined />, label: 'Type & OptionType' },
        { key: 'mail-tmpl', icon: <MailOutlined />, label: 'Quản lý mẫu mail' },
        { key: 'mail-stat', icon: <BarChartOutlined />, label: 'Thống kê email' },
      ]
    },
    { type: 'divider' },
    { 
      key: 'logout', 
      icon: <LogoutOutlined className="text-red-500" />, 
      label: 'Đăng xuất',
      onClick: handleLogout 
    }
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      width={260}
      className="border-r border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-50">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-orange-400 rotate-45 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <Text className="font-bold text-blue-700 text-lg">Sách Điện Tử</Text>
          </div>
        )}
        <div 
          className="cursor-pointer text-gray-400 hover:text-blue-600 transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined size={20} /> : <MenuFoldOutlined size={20} />}
        </div>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['user-mgmt']}
        items={menuItems}
        className="admin-sidebar-menu h-[calc(100vh-64px)] overflow-y-auto border-none"
      />
      <style>{`
        .admin-sidebar-menu .ant-menu-item-selected {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        .admin-sidebar-menu .ant-menu-item-selected .anticon {
          color: white !important;
        }
        .admin-sidebar-menu .ant-menu-item-group-title {
          font-weight: 700;
          color: #94a3b8;
          font-size: 11px;
          padding-left: 24px;
          margin-top: 16px;
        }
      `}</style>
    </Sider>
  );
};

export default AdminSidebar;
