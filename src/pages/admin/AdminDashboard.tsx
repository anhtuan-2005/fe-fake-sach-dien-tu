import React from 'react';
import { Layout } from 'antd';
import UserTable from './components/UserTable';

const { Content } = Layout;

const AdminDashboard: React.FC = () => {
  return (
    <Content className="px-6 pb-6">
      {/* Main coordination component */}
      <UserTable />
    </Content>
  );
};

export default AdminDashboard;
