import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, App } from 'antd';
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
        form.setFieldsValue({
          ...editingUser,
          role: editingUser.account_type === 'Admin' ? 'ADMIN' : 
                editingUser.account_type === 'Giáo viên' ? 'TEACHER' : 'STUDENT'
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Map role back to DB strings
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
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Modal
      title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={editingUser ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        initialValues={{ role: 'STUDENT', level: 'Cấp 1' }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="user_code"
            label="Mã người dùng"
          >
            <Input placeholder="Ví dụ: GV01, HS01" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }]}
          >
            <Input placeholder="0123456789" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Loại tài khoản"
            rules={[{ required: true }]}
          >
            <Select options={[
              { value: 'ADMIN', label: 'Admin' },
              { value: 'TEACHER', label: 'Giáo viên' },
              { value: 'STUDENT', label: 'Học sinh' }
            ]} />
          </Form.Item>

          <Form.Item
            name="level"
            label="Cấp học"
          >
            <Select options={[
              { value: 'Cấp 1', label: 'Cấp 1' },
              { value: 'Cấp 2', label: 'Cấp 2' },
              { value: 'Cấp 3', label: 'Cấp 3' }
            ]} />
          </Form.Item>
        </div>
        
        {!editingUser && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu khởi tạo" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserModal;
