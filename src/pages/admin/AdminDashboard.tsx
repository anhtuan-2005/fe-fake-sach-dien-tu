import React, { useState } from 'react';
import { Layout, Button, Space, Typography, Tabs } from 'antd';
import { HistoryOutlined, PlusOutlined, UploadOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import UserFilter from './components/UserFilter';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import { User, UserFilterState } from '../../types';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<UserFilterState>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = (newFilters: UserFilterState) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1); // Trigger re-fetch
  };

  return (
    <>
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
              type="primary" 
              icon={<PlusOutlined />} 
              className="bg-blue-600 font-semibold"
              onClick={handleAddUser}
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
        <UserFilter onSearch={handleSearch} onReset={handleReset} />

        {/* Tabs Section */}
        <div className="bg-white px-4 pt-2 rounded-t-lg border-b border-gray-100">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'active',
                label: (
                  <span>
                    <TeamOutlined /> Danh sách người dùng
                  </span>
                ),
              },
              {
                key: 'trash',
                label: (
                  <span className="text-red-500">
                    <DeleteOutlined /> Thùng rác
                  </span>
                ),
              },
            ]}
          />
        </div>

        {/* Table Section */}
        <UserTable 
          key={`${activeTab}-${refreshKey}`}
          filters={filters} 
          showDeleted={activeTab === 'trash'}
          onEdit={handleEditUser}
        />
      </Content>

      <UserModal 
        open={isModalOpen}
        editingUser={editingUser}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default AdminDashboard;
