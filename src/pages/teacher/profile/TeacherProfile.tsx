import React from 'react';
import { Row, Col, Typography, Breadcrumb, Card, Tag } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import useAuthStore from '../../../store/useAuthStore';
import { User } from '../../../types';
import TeacherAvatar from './components/TeacherAvatar';
import TeacherForm from './components/TeacherForm';

const { Title, Text } = Typography;

export const TeacherProfile: React.FC = () => {
  const { user, setAuth } = useAuthStore();

  const handleUpdateSuccess = (updatedUser: User) => {
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
    <div className="max-w-[1250px] mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { title: <><HomeOutlined /> <span>Trang chủ</span></>, href: '/' },
            { title: 'Cá nhân' },
            { title: 'Thông tin tài khoản' },
          ]}
          className="mb-4"
        />
        <div>
          <Title level={2} className="!mb-1 font-bold text-gray-800">Hồ sơ cá nhân</Title>
          <Text type="secondary">Quản lý thông tin hồ sơ giáo viên, cập nhật ảnh đại diện và thiết lập bảo mật.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột bên trái: Avatar & Quick Info */}
        <Col xs={24} md={8} lg={7}>
          <div className="flex flex-col gap-6">
            {/* Avatar Card */}
            <Card className="border-0 shadow-sm rounded-2xl flex flex-col items-center p-4">
              <div className="w-full flex flex-col items-center">
                <TeacherAvatar 
                  user={user} 
                  onUploadSuccess={handleAvatarSuccess} 
                />
                <div className="mt-4 text-center">
                  <Tag color="orange" className="px-3 py-0.5 rounded-full font-bold border-amber-100">
                    Giáo viên Portal
                  </Tag>
                </div>
              </div>
            </Card>

            {/* Quick stats or details */}
            <Card title={<span className="font-bold text-gray-700">Trạng thái tài khoản</span>} className="border-0 shadow-sm rounded-2xl">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Ngày tham gia</span>
                  <Text className="font-semibold text-gray-700">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : '-'}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Bảo mật tài khoản</span>
                  <Tag color="success" className="m-0 rounded-full font-semibold">An toàn</Tag>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Cột bên phải: Form chỉnh sửa chi tiết */}
        <Col xs={24} md={16} lg={17}>
          <TeacherForm 
            user={user} 
            onUpdateSuccess={handleUpdateSuccess} 
          />
        </Col>
      </Row>
    </div>
  );
};

export default TeacherProfile;
