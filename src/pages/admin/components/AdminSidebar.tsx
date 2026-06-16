import React from 'react';
import { Layout, Menu, Typography, App } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../api';
import useAuthStore from '../../../store/useAuthStore';
import {
  HomeOutlined,
  BellOutlined,
  UserOutlined,
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
  HistoryOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text } = Typography;

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const logout = useAuthStore((state) => state.logout);

  const menuItems: any[] = [
    { key: '/admin', icon: <HomeOutlined />, label: 'Trang chủ', onClick: () => navigate('/admin') },
    { key: '/admin/profile', icon: <UserOutlined />, label: 'Thông tin cá nhân', onClick: () => navigate('/admin/profile') },
    { key: 'notif', icon: <BellOutlined />, label: 'Thông báo' },
    { key: 'offline', icon: <BookOutlined />, label: 'Sách điện tử (offline)' },
    { key: 'elearning', icon: <ReadOutlined />, label: 'Bài giảng E-learning' },
    { key: '/admin/student-classes', icon: <BookOutlined />, label: 'Lớp học', onClick: () => navigate('/admin/student-classes') },
    { key: 'tools', icon: <ToolOutlined />, label: 'Công cụ' },
    { key: 'game', icon: <PlaySquareOutlined />, label: 'Education Game' },
    { key: 'guide', icon: <QuestionCircleOutlined />, label: 'Hướng dẫn sử dụng' },
    { type: 'divider' },
    { 
      key: 'admin-group', 
      label: !collapsed ? 'ADMINISTRATORS' : '', 
      type: 'group',
      children: [
        { key: 'library', icon: <BankOutlined />, label: 'Thư viện' },
        { key: '/admin/classes', icon: <FolderOpenOutlined />, label: 'Quản lý lớp học', onClick: () => navigate('/admin/classes') },
        { key: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý người dùng', onClick: () => navigate('/admin/users') },
        { key: '/admin/question-bank', icon: <DatabaseOutlined />, label: 'Ngân hàng câu hỏi', onClick: () => navigate('/admin/question-bank') },
        { key: '/admin/type-configs', icon: <SettingOutlined />, label: 'Type & OptionType', onClick: () => navigate('/admin/type-configs') },
        { key: 'mail-tmpl', icon: <MailOutlined />, label: 'Quản lý mẫu mail' },
        { key: 'mail-stat', icon: <BarChartOutlined />, label: 'Thống kê email' },
      ]
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      width={260}
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
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
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
