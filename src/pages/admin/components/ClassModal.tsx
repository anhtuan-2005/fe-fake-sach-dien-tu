import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, App } from 'antd';
import { Classroom } from '../../../types';
import api from '../../../api';
import useAuthStore from '../../../store/useAuthStore';

interface ClassModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingClass: Classroom | null;
}

const ClassModal: React.FC<ClassModalProps> = ({ open, onCancel, onSuccess, editingClass }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [loading, setLoading] = React.useState(false);
  const [teachers, setTeachers] = React.useState<any[]>([]);
  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/admin/users', { params: { role: 'Giáo viên', limit: 100 } });
        if (response.data.success) {
          setTeachers(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };
    if (open) {
      if (isAdmin) {
        fetchTeachers();
      }
      if (editingClass) {
        form.setFieldsValue(editingClass);
      } else {
        form.resetFields();
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        form.setFieldsValue({ 
          status: 1,
          class_code: `CL${randomStr}`
        });
      }
    }
  }, [open, editingClass, form, isAdmin]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingClass) {
        await api.put(`/admin/classes/${editingClass.id}`, values);
        message.success('Cập nhật lớp học thành công');
      } else {
        await api.post('/admin/classes', values);
        message.success('Thêm lớp học thành công');
      }

      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingClass ? 'Chỉnh sửa lớp học' : 'Thêm lớp học mới'}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 1 }}
      >
        <Form.Item
          name="class_code"
          label="Mã lớp (Tự động)"
          rules={[{ required: true, message: 'Vui lòng nhập mã lớp' }]}
        >
          <Input placeholder="Hệ thống tự sinh" readOnly className="bg-gray-50 h-10 rounded-lg" />
        </Form.Item>

        <Form.Item
          name="class_name"
          label="Tên lớp"
          rules={[{ required: true, message: 'Vui lòng nhập tên lớp' }]}
        >
          <Input placeholder="VD: Lớp 12A1" className="h-10 rounded-lg" />
        </Form.Item>

        {isAdmin && (
          <Form.Item
            name="teacher_id"
            label="Giáo viên chủ nhiệm"
          >
            <Select 
              placeholder="Chọn giáo viên" 
              className="h-10 rounded-lg"
              showSearch
              optionFilterProp="children"
              allowClear
            >
              {teachers.map(t => (
                <Select.Option key={t.id} value={t.id}>{t.full_name} ({t.user_code})</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true }]}
        >
          <Select className="h-10 rounded-lg">
            <Select.Option value={1}>Đang dùng</Select.Option>
            <Select.Option value={0}>Ngừng sử dụng</Select.Option>
          </Select>
        </Form.Item>

        {editingClass && (
          <Form.Item
            name="completion_status"
            label="Trạng thái hoàn thành"
            rules={[{ required: true }]}
          >
            <Select className="h-10 rounded-lg">
              <Select.Option value={0}>Đang học</Select.Option>
              <Select.Option value={1}>Hoàn thành</Select.Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="description"
          label="Ghi chú"
        >
          <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" className="rounded-lg" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClassModal;
