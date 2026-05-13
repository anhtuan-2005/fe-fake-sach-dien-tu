import React, { useState } from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { HistoryOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import UserFilter from './components/UserFilter';
import UserTable from './components/UserTable';

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className="min-h-screen bg-[#e6f7ff]">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout className="bg-transparent">
        <AdminHeader />
        
        <Content className="px-6 pb-6">
          {/* Main Card Header */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
            <Space size={16}>
              <Title level={4} className="m-0 text-gray-700">Quản lý người dùng</Title>
              <Button 
                type="default" 
                icon={<HistoryOutlined />} 
                className="flex items-center text-gray-500 border-gray-200"
              >
                Lịch sử thao tác
              </Button>
            </Space>

            <Space size={12}>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                className="bg-blue-600 font-semibold"
              >
                Thêm người dùng
              </Button>
              <Button 
                icon={<UploadOutlined />} 
                className="text-gray-600 border-gray-300"
              >
                Nhập từ excel
              </Button>
            </Space>
          </div>

          {/* Filter Section */}
          <UserFilter />

          {/* Table Section */}
          <UserTable />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
