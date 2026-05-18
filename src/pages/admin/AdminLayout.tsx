import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className="min-h-screen bg-[#e6f7ff]">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout 
        className="bg-transparent" 
        style={{ 
          marginLeft: collapsed ? 80 : 260, 
          transition: 'margin-left 0.2s' 
        }}
      >
        <AdminHeader />
        <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
