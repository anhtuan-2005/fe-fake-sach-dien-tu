import React, { useState } from 'react';
import { Form, Input, Button, Card, App } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../../../../api';
import { ApiResponse } from '../../../../types';

const ProfileSecurity: React.FC = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await api.put<ApiResponse>('/auth/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });

      if (response.data.success) {
        message.success('Đổi mật khẩu thành công!');
        form.resetFields();
      } else {
        throw new Error(response.data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      message.error(error.response?.data?.message || 'Mật khẩu cũ không chính xác hoặc đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Bảo mật tài khoản" className="shadow-sm border-gray-100">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
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
          <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="••••••••" />
        </Form.Item>

        <Form.Item className="mb-0 mt-4">
          <Button type="primary" danger htmlType="submit" loading={loading} block size="large">
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileSecurity;
