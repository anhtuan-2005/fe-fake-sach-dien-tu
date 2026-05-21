import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { HistoryOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import UserTable from './components/UserTable';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Content className="px-6 pb-6">
      {/* Main Card Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
        <Space size={16}>
          <Title level={4} className="m-0 text-gray-700">Quản lý người dùng</Title>
          <Button 
            type="default" 
            icon={<HistoryOutlined />} 
            className="flex items-center text-gray-500 border-gray-200"
            onClick={() => navigate('/admin/logs')}
          >
            Lịch sử thao tác
          </Button>
        </Space>

        <Space size={12}>
          <Button 
            icon={<UploadOutlined />} 
            className="text-gray-600 border-gray-300"
          >
            Nhập từ excel
          </Button>
        </Space>
      </div>

      {/* Main coordination component */}
      <UserTable />
    </Content>
  );
};

export default AdminDashboard;
