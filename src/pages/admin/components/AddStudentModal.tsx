import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Table, Input, Button, Space, App, Tag } from 'antd';
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../../../api';
import { ApiResponse } from '../../../types';

interface AvailableStudent {
  id: number;
  user_code: string;
  full_name: string;
  email: string;
}

interface AddStudentModalProps {
  open: boolean;
  onCancel: () => void;
  classId: string | number;
  onSuccess: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ open, onCancel, classId, onSuccess }) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<AvailableStudent[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchAvailableStudents = useCallback(async (keyword: string = '') => {
    if (!classId) return;
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<AvailableStudent[]>>(`/admin/classes/${classId}/available-students`, {
        params: { keyword }
      });
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error: any) {
      message.error('Lỗi khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  useEffect(() => {
    if (open) {
      fetchAvailableStudents();
      setSearchKeyword('');
    }
  }, [open, fetchAvailableStudents]);

  const handleAddStudent = async (studentId: number) => {
    try {
      const response = await api.post(`/admin/classes/${classId}/students`, { studentId });
      if (response.data.success) {
        message.success('Đã thêm học sinh vào lớp');
        fetchAvailableStudents(searchKeyword);
        onSuccess();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi thêm học sinh');
    }
  };

  const columns = [
    {
      title: 'Mã HS',
      dataIndex: 'user_code',
      key: 'user_code',
      width: 120,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string) => <span className="font-medium">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: AvailableStudent) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<UserAddOutlined />} 
          onClick={() => handleAddStudent(record.id)}
        >
          Thêm
        </Button>
      )
    }
  ];

  return (
    <Modal
      title="Thêm học sinh vào lớp"
      open={open}
      onCancel={onCancel}
      width={700}
      footer={null}
      destroyOnHidden
    >
      <div className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
          <p className="text-blue-700 text-sm mb-0">
            Tìm kiếm học sinh chưa tham gia lớp học này để thêm vào danh sách.
          </p>
        </div>

        <Space className="w-full mb-4">
          <Input 
            placeholder="Nhập tên, email hoặc mã học sinh..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={() => fetchAvailableStudents(searchKeyword)}
            style={{ width: 400 }}
            prefix={<SearchOutlined className="text-gray-400" />}
          />
          <Button type="primary" onClick={() => fetchAvailableStudents(searchKeyword)}>Tìm kiếm</Button>
        </Space>

        <Table 
          loading={loading}
          columns={columns}
          dataSource={students}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Không tìm thấy học sinh nào phù hợp' }}
          bordered
          size="small"
        />
      </div>
    </Modal>
  );
};

export default AddStudentModal;
