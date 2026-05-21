import React from 'react';
import { Row, Col, Typography, Breadcrumb, Space } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import useAuthStore from '../../../store/useAuthStore';
import { User } from '../../../types';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileForm from './components/ProfileForm';
import ProfileSecurity from './components/ProfileSecurity';

const { Title, Text } = Typography;

const AdminProfile: React.FC = () => {
  const { user, setAuth } = useAuthStore();

  const handleUpdateSuccess = (updatedUser: User) => {
    // Cập nhật lại user trong store nhưng giữ nguyên token
    const token = useAuthStore.getState().token;
    setAuth(updatedUser, token);
  };

  const handleAvatarSuccess = (newUrl: string) => {
    if (user) {
      const updatedUser: User = { ...user, avatar_url: newUrl };
      const token = useAuthStore.getState().token;
      setAuth(updatedUser, token);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { title: <><HomeOutlined /> <span>Trang chủ</span></>, href: '/admin' },
            { title: 'Cá nhân' },
            { title: 'Thông tin tài khoản' },
          ]}
          className="mb-4"
        />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Title level={2} className="!mb-1">Hồ sơ cá nhân</Title>
            <Text type="secondary">Quản lý thông tin cá nhân và thiết lập bảo mật tài khoản của bạn</Text>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột bên trái: Avatar & Quick Info */}
        <Col xs={24} lg={8} xl={7}>
          <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <ProfileAvatar 
                avatarUrl={user?.avatar_url || undefined} 
                onUploadSuccess={handleAvatarSuccess} 
              />
              <div className="mt-6 text-center">
                <Title level={4} className="!mb-1">{user?.full_name}</Title>
                <Text type="secondary" className="block mb-2">{user?.email}</Text>
                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium inline-block border border-blue-100">
                  {user?.role === 'admin' ? 'Quản trị viên hệ thống' : 'Người dùng'}
                </div>
              </div>
            </div>

            {/* Thống kê nhanh hoặc thông tin thêm (Tùy chọn) */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
              <Title level={5} className="!text-white !mb-4">Trạng thái tài khoản</Title>
              <Space orientation="vertical" className="w-full">
                <div className="flex justify-between items-center pb-3 border-b border-blue-500/30">
                  <Text className="!text-blue-100">Ngày tham gia</Text>
                  <Text className="!text-white font-medium">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                  </Text>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <Text className="!text-blue-100">Bảo mật</Text>
                  <Text className="!text-white font-medium">Cấp độ cao</Text>
                </div>
              </Space>
            </div>
          </div>
        </Col>

        {/* Cột bên phải: Form chỉnh sửa */}
        <Col xs={24} lg={16} xl={17}>
          <div className="flex flex-col gap-6">
            <ProfileForm 
              user={user} 
              onUpdateSuccess={handleUpdateSuccess} 
            />
            
            <ProfileSecurity />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfile;
