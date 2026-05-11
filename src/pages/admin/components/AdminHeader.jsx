import React from 'react';
import { Layout, Breadcrumb, Badge, Avatar, Space } from 'antd';
import { HomeOutlined, BellOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

const AdminHeader = () => {
  return (
    <Header className="bg-transparent px-6 flex items-center justify-between h-16">
      <Breadcrumb
        items={[
          {
            href: '',
            title: <HomeOutlined />,
          },
          {
            title: 'Administration',
          },
        ]}
        className="text-white opacity-90"
      />

      <Space size={24} className="flex items-center">
        <Badge count={9} size="small" offset={[-2, 4]} className="cursor-pointer">
          <div className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
            <BellOutlined className="text-white text-lg flex" />
          </div>
        </Badge>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <Avatar 
            size="large" 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Testbank"
            icon={<UserOutlined />}
            className="border-2 border-white/50 group-hover:border-white transition-all"
          />
          <span className="text-white font-semibold group-hover:opacity-80 transition-opacity">Testbank Admin</span>
        </div>
      </Space>
    </Header>
  );
};

export default AdminHeader;
