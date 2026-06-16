import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Card, App, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { User, ApiResponse } from '../../../../types';
import api from '../../../../api';

interface TeacherFormProps {
  user: User | null;
  onUpdateSuccess: (updatedUser: User) => void;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ user, onUpdateSuccess }) => {
  const [infoForm] = Form.useForm();
  const [passForm] = Form.useForm();
  const { message } = App.useApp();

  const [infoLoading, setInfoLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Điền dữ liệu ban đầu
  useEffect(() => {
    if (user) {
      infoForm.setFieldsValue({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || '',
        user_code: user.user_code,
        level: user.level || '', // 'Tổ bộ môn' map với trường 'level'
      });
    }
  }, [user, infoForm]);

  // Cập nhật thông tin cá nhân
  const handleUpdateInfo = async (values: any) => {
    if (!user) return;
    
    setInfoLoading(true);
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${user.id}`, {
        full_name: values.full_name,
        phone: values.phone,
        level: values.level, // Tổ bộ môn
      });
      
      if (response.data.success && response.data.data) {
        message.success('Cập nhật thông tin giáo viên thành công!');
        onUpdateSuccess(response.data.data);
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      console.error('Lỗi khi cập nhật profile giáo viên:', error);
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin.');
    } finally {
      setInfoLoading(false);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (values: any) => {
    setPassLoading(true);
    try {
      // Gọi API đổi mật khẩu: PUT /api/auth/change-password
      const response = await api.put<ApiResponse>('/auth/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });

      if (response.data.success) {
        message.success('Thay đổi mật khẩu tài khoản thành công!');
        passForm.resetFields();
      } else {
        throw new Error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error: any) {
      console.error('Lỗi đổi mật khẩu giáo viên:', error);
      message.error(error.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc lỗi hệ thống.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Khung sửa thông tin cá nhân */}
      <Card title={<span className="font-bold text-gray-700">Thông tin giáo viên</span>} className="border-0 shadow-sm rounded-2xl">
        <Form
          form={infoForm}
          layout="vertical"
          onFinish={handleUpdateInfo}
          requiredMark="optional"
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="full_name"
                label={<span className="font-semibold text-gray-600 text-xs">Họ và tên</span>}
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" className="h-10 rounded-lg" />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label={<span className="font-semibold text-gray-600 text-xs">Email tài khoản</span>}
              >
                <Input prefix={<MailOutlined className="text-gray-400" />} disabled placeholder="example@gmail.com" className="h-10 rounded-lg bg-slate-50" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label={<span className="font-semibold text-gray-600 text-xs">Số điện thoại liên hệ</span>}
                rules={[
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                ]}
              >
                <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0123456789" className="h-10 rounded-lg" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="level"
                label={<span className="font-semibold text-gray-600 text-xs">Tổ bộ môn</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tổ bộ môn' }]}
              >
                <Input prefix={<BankOutlined className="text-gray-400" />} disabled placeholder="VD: Tổ Tiếng Anh, Tổ Tự nhiên..." className="h-10 rounded-lg bg-slate-50" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="user_code"
                label={<span className="font-semibold text-gray-600 text-xs">Mã giáo viên</span>}
              >
                <Input prefix={<SafetyCertificateOutlined className="text-gray-400" />} disabled className="h-10 rounded-lg bg-slate-50" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0 mt-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={infoLoading} 
              block 
              size="large" 
              className="bg-blue-600 hover:bg-blue-700 border-none font-bold rounded-lg h-11"
            >
              Lưu thay đổi thông tin
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Khung đổi mật khẩu */}
      <Card title={<span className="font-bold text-gray-700">Đổi mật khẩu bảo mật</span>} className="border-0 shadow-sm rounded-2xl">
        <Form
          form={passForm}
          layout="vertical"
          onFinish={handleChangePassword}
          requiredMark={false}
        >
          <Form.Item
            name="oldPassword"
            label={<span className="font-semibold text-gray-600 text-xs">Mật khẩu hiện tại</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={<span className="font-semibold text-gray-600 text-xs">Mật khẩu mới</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('oldPassword') !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới không được trùng mật khẩu cũ!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="font-semibold text-gray-600 text-xs">Xác nhận mật khẩu mới</span>}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" className="h-10 rounded-lg" />
          </Form.Item>

          <Form.Item className="mb-0 mt-4">
            <Button 
              type="primary" 
              danger 
              htmlType="submit" 
              loading={passLoading} 
              block 
              size="large" 
              className="font-bold rounded-lg h-11"
            >
              Đổi mật khẩu tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TeacherForm;
