import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Breadcrumb, Space, Form, Input, Button, Card, App, Tag } from 'antd';
import { HomeOutlined, UserOutlined, MailOutlined, PhoneOutlined, SafetyCertificateOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import useAuthStore from '../../../store/useAuthStore';
import { User, ApiResponse } from '../../../types';
import api from '../../../api';
import ProfileAvatar from '../../admin/profile/components/ProfileAvatar';
import ProfileSecurity from '../../admin/profile/components/ProfileSecurity';

const { Title, Text } = Typography;

export const StudentProfile: React.FC = () => {
  const { user, setAuth } = useAuthStore();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || '',
        user_code: user.user_code,
        role_text: 'Học sinh',
        level: user.level || 'Cấp 1',
      });
    }
  }, [user, form]);

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

  const onFinish = async (values: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // API cập nhật thông tin: PUT /api/users/:id
      const response = await api.put<ApiResponse<User>>(`/users/${user.id}`, {
        full_name: values.full_name,
        phone: values.phone,
      });
      
      if (response.data.success && response.data.data) {
        message.success('Cập nhật thông tin thành công!');
        handleUpdateSuccess(response.data.data);
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật profile học sinh:', error);
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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
          <Text type="secondary">Quản lý thông tin học tập, cập nhật ảnh đại diện và đổi mật khẩu.</Text>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột bên trái: Avatar & Academic stats */}
        <Col xs={24} lg={8} xl={7}>
          <div className="flex flex-col gap-6">
            {/* Avatar Card */}
            <Card className="border-0 shadow-sm rounded-2xl flex flex-col items-center p-4">
              <div className="w-full flex flex-col items-center">
                <ProfileAvatar 
                  avatarUrl={user?.avatar_url || undefined} 
                  onUploadSuccess={handleAvatarSuccess} 
                />
                <div className="mt-6 text-center w-full">
                  <Title level={4} className="!mb-1 font-bold text-gray-700">{user?.full_name}</Title>
                  <Text type="secondary" className="block mb-3 text-xs">{user?.email}</Text>
                  <Tag color="green" className="px-3 py-0.5 rounded-full font-bold border-emerald-100">
                    Học sinh Portal
                  </Tag>
                </div>
              </div>
            </Card>

            {/* Academic Summary Card */}
            <Card 
              title={<span className="font-bold text-gray-700">Tóm tắt học tập</span>} 
              className="border-0 shadow-sm rounded-2xl"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <BookOutlined className="text-emerald-500" /> Bài tập đã hoàn thành
                  </span>
                  <Text className="font-bold text-gray-700">45 bài</Text>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <TrophyOutlined className="text-yellow-500" /> Điểm trung bình lớp
                  </span>
                  <Text className="font-extrabold text-blue-600 text-base">8.5 / 10</Text>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        {/* Cột bên phải: Form chi tiết & Bảo mật */}
        <Col xs={24} lg={16} xl={17}>
          <div className="flex flex-col gap-6">
            {/* Form sửa thông tin */}
            <Card title={<span className="font-bold text-gray-700">Thông tin cá nhân học sinh</span>} className="border-0 shadow-sm rounded-2xl">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark="optional"
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="full_name"
                      label="Họ và tên"
                      rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                      <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" className="h-10 rounded-lg" />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email tài khoản"
                    >
                      <Input prefix={<MailOutlined className="text-gray-400" />} disabled placeholder="example@gmail.com" className="h-10 rounded-lg bg-slate-50" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại liên hệ"
                      rules={[
                        { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                      ]}
                    >
                      <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0123456789" className="h-10 rounded-lg" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="user_code"
                      label="Mã học sinh"
                    >
                      <Input prefix={<SafetyCertificateOutlined className="text-gray-400" />} disabled className="h-10 rounded-lg bg-slate-50" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="role_text"
                      label="Vai trò hệ thống"
                    >
                      <Input disabled className="h-10 rounded-lg bg-slate-50" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="level"
                      label="Khối học hiện tại"
                    >
                      <Input disabled className="h-10 rounded-lg bg-slate-50" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item className="mb-0 mt-4">
                  <Button type="primary" htmlType="submit" loading={loading} block size="large" className="bg-blue-600 hover:bg-blue-700 border-none font-bold rounded-lg h-11">
                    Lưu thay đổi thông tin
                  </Button>
                </Form.Item>
              </Form>
            </Card>
            
            {/* Form đổi mật khẩu */}
            <div className="profile-security-card">
              <ProfileSecurity />
            </div>
          </div>
        </Col>
      </Row>

      <style>{`
        .profile-security-card .ant-card {
          border: 0 !important;
          border-radius: 16px !important;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        .profile-security-card .ant-card-head {
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .profile-security-card .ant-card-head-title {
          font-weight: 700 !important;
          color: #374151 !important;
        }
        .profile-security-card .ant-input-affix-wrapper {
          border-radius: 8px !important;
          height: 40px !important;
        }
        .profile-security-card .ant-btn-danger {
          border-radius: 8px !important;
          height: 44px !important;
          font-weight: 700 !important;
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
