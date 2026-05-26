import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, App } from 'antd';
import { User } from '../../../types';
import api from '../../../api';

interface UserModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingUser: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ open, onCancel, onSuccess, editingUser }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (open) {
      if (editingUser) {
        const role = editingUser.account_type === 'Admin' ? 'ADMIN' : 
                     editingUser.account_type === 'Giáo viên' ? 'TEACHER' : 'STUDENT';
        
        form.setFieldsValue({
          ...editingUser,
          role: role
        });
      } else {
        form.resetFields();
        // Tự động sinh mã người dùng mặc định cho Học sinh (role mặc định)
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        form.setFieldsValue({ user_code: `HS${randomStr}` });
      }
    }
  }, [open, editingUser, form]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.role && !editingUser) {
      const prefix = changedValues.role === 'ADMIN' ? 'AD' : 
                     changedValues.role === 'TEACHER' ? 'GV' : 'HS';
      const randomStr = Math.floor(1000 + Math.random() * 9000);
      form.setFieldsValue({ user_code: `${prefix}${randomStr}` });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const payload = {
        ...values,
        account_type: values.role === 'ADMIN' ? 'Admin' : 
                      values.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'
      };

      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, payload);
        message.success('Cập nhật người dùng thành công');
      } else {
        await api.post('/admin/users', payload);
        message.success('Thêm người dùng thành công');
      }
      
      onSuccess();
    } catch (error: any) {
      console.error('Submit error:', error);
      if (error.response) {
        message.error(error.response.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu');
      }
    }
  };

  return (
    <Modal
      title={
        <div className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-100 mr-8">
          {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={editingUser ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      width={700}
      mask={{ closable: false }}
      destroyOnHidden
      centered
      className="responsive-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-6"
        initialValues={{ role: 'STUDENT', level: 'Cấp 1' }}
        onValuesChange={handleValuesChange}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="full_name"
              label={<span className="font-semibold text-gray-700">Họ và tên</span>}
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nguyễn Văn A" className="h-10 rounded-lg" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="user_code"
              label={<span className="font-semibold text-gray-700">Mã người dùng (Tự động)</span>}
            >
              <Input placeholder="Hệ thống tự sinh" className="h-10 rounded-lg bg-gray-50" readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="email"
              label={<span className="font-semibold text-gray-700">Email</span>}
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="example@gmail.com" disabled={!!editingUser} className="h-10 rounded-lg" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="phone"
              label={<span className="font-semibold text-gray-700">Số điện thoại</span>}
              rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}
            >
              <Input placeholder="0123456789" className="h-10 rounded-lg" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="role"
              label={<span className="font-semibold text-gray-700">Loại tài khoản</span>}
              rules={[{ required: true, message: 'Vui lòng chọn loại tài khoản' }]}
            >
              <Select
                className="h-10 rounded-lg"
                options={[
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'TEACHER', label: 'Giáo viên' },
                  { value: 'STUDENT', label: 'Học sinh' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="level"
              label={<span className="font-semibold text-gray-700">Cấp học</span>}
            >
              <Select
                className="h-10 rounded-lg"
                options={[
                  { value: 'Cấp 1', label: 'Cấp 1' },
                  { value: 'Cấp 2', label: 'Cấp 2' },
                  { value: 'Cấp 3', label: 'Cấp 3' }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        
        {!editingUser && (
          <Form.Item
            name="password"
            label={<span className="font-semibold text-gray-700">Mật khẩu khởi tạo</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" className="h-10 rounded-lg" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserModal;
