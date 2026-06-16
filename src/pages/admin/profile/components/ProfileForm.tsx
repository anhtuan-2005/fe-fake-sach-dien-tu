import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, Card, App } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { User, ApiResponse } from '../../../../types';
import api from '../../../../api';

interface ProfileFormProps {
  user: User | null;
  onUpdateSuccess: (updatedUser: User) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';

  const levelOptions = isAdmin 
    ? [
        { value: 'N/A', label: 'N/A' },
        { value: 'Cấp 1', label: 'Cấp 1' },
        { value: 'Cấp 2', label: 'Cấp 2' },
        { value: 'Cấp 3', label: 'Cấp 3' },
      ]
    : [
        { value: 'Sở Giáo dục', label: 'Sở Giáo dục' },
        { value: 'Phòng Giáo dục', label: 'Phòng Giáo dục' },
        { value: 'Trường học', label: 'Trường học' },
      ];

  if (user?.level && !levelOptions.some(opt => opt.value === user.level)) {
    levelOptions.unshift({ value: user.level, label: user.level });
  }

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        level: user.level,
        user_code: user.user_code,
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await api.put<ApiResponse<User>>(`/users/${user.id}`, values);
      
      if (response.data.success && response.data.data) {
        message.success('Cập nhật thông tin thành công!');
        onUpdateSuccess(response.data.data);
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      message.error(error.response?.data?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Thông tin cá nhân" className="shadow-sm border-gray-100">
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
              <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input prefix={<MailOutlined className="text-gray-400" />} disabled placeholder="example@gmail.com" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input prefix={<PhoneOutlined className="text-gray-400" />} placeholder="0123456789" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="user_code"
              label="Mã người dùng"
            >
              <Input prefix={<SafetyCertificateOutlined className="text-gray-400" />} disabled />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="role"
              label="Vai trò"
            >
              <Select disabled>
                <Select.Option value="admin">Quản trị viên</Select.Option>
                <Select.Option value="user">Người dùng</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="level"
              label={isTeacher ? "Tổ bộ môn" : "Cấp bậc / Đơn vị"}
            >
              <Select 
                placeholder={isTeacher ? "Chưa phân công" : "Chọn cấp bậc / đơn vị"} 
                className="h-10 rounded-lg"
                allowClear={!isTeacher}
                disabled={isTeacher}
              >
                {levelOptions.map(opt => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0 mt-4">
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileForm;
