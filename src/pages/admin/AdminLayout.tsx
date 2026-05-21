import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  // Theo dõi kích thước màn hình để tự động thu gọn sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    // Gọi ngay lần đầu
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Layout className="min-h-screen bg-[#e6f7ff]">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <Layout 
        className="bg-transparent" 
        style={{ 
          // Trên mobile, nếu collapsed thì margin cực nhỏ hoặc bằng 0
          // Nếu không collapsed trên mobile (ít xảy ra) thì cũng không nên chiếm quá nhiều
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 260), 
          transition: 'margin-left 0.2s',
          width: '100%',
          overflowX: 'hidden'
        }}
      >
        <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} />
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </Layout>

      <style>{`
        .admin-content-wrapper {
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        
        /* Fix cho tiêu đề không bị xếp dọc trên mobile */
        @media (max-width: 767px) {
          .ant-layout-sider {
            display: ${collapsed ? 'none' : 'block'} !important;
            position: fixed !important;
            z-index: 1001;
            height: 100vh !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default AdminLayout;
