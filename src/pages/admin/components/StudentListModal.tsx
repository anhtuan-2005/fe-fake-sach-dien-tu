import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Button, Space, Input, App, Tag, Tooltip, Popconfirm } from 'antd';
import { SearchOutlined, UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../api';
import { Classroom, ApiResponse } from '../../../types';

interface StudentListModalProps {
  open: boolean;
  onCancel: () => void;
  classroom: Classroom | null;
  onUpdateCount: () => void;
}

const StudentListModal: React.FC<StudentListModalProps> = ({ open, onCancel, classroom, onUpdateCount }) => {
  const { message } = App.useApp();
  const [students, setStudents] = useState<any[]>([]);
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!classroom) return;
    setLoading(true);
    try {
      const response = await api.get(`/admin/classes/${classroom.id}/students`);
      if (response.data.success) {
        setStudents(response.data.data);
      }
    } catch (error: any) {
      message.error('Lỗi khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  }, [classroom, message]);

  const fetchAvailableStudents = useCallback(async (keyword: string = '') => {
    if (!classroom) return;
    try {
      const response = await api.get(`/admin/classes/${classroom.id}/available-students`, {
        params: { keyword }
      });
      if (response.data.success) {
        setAvailableStudents(response.data.data);
      }
    } catch (error: any) {
      console.error('Lỗi khi tải danh sách học sinh có sẵn');
    }
  }, [classroom]);

  useEffect(() => {
    if (open && classroom) {
      fetchStudents();
      setShowAddSection(false);
      setSearchKeyword('');
    }
  }, [open, classroom, fetchStudents]);

  const handleAddStudent = async (studentId: number) => {
    if (!classroom) return;
    try {
      const response = await api.post(`/admin/classes/${classroom.id}/students`, { studentId });
      if (response.data.success) {
        message.success('Đã thêm học sinh vào lớp');
        fetchStudents();
        fetchAvailableStudents(searchKeyword);
        onUpdateCount();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi thêm học sinh');
    }
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!classroom) return;
    try {
      const response = await api.delete(`/admin/classes/${classroom.id}/students/${studentId}`);
      if (response.data.success) {
        message.success('Đã xóa học sinh khỏi lớp');
        fetchStudents();
        onUpdateCount();
      }
    } catch (error: any) {
      message.error('Lỗi khi xóa học sinh');
    }
  };

  const studentColumns = [
    { title: 'Mã HS', dataIndex: 'user_code', key: 'user_code', width: 100 },
    { title: 'Họ và tên', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa học sinh"
          description="Bạn có chắc muốn xóa học sinh này khỏi lớp?"
          onConfirm={() => handleRemoveStudent(record.id)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  const availableColumns = [
    { title: 'Mã HS', dataIndex: 'user_code', key: 'user_code', width: 100 },
    { title: 'Họ và tên', dataIndex: 'full_name', key: 'full_name' },
    {
      title: 'Thao tác',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
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
      title={`Quản lý học sinh - ${classroom?.class_name}`}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Tag color="blue" className="text-sm px-3 py-1">Sĩ số hiện tại: {students.length}</Tag>
          <Button 
            type={showAddSection ? "default" : "primary"}
            icon={<UserAddOutlined />}
            onClick={() => {
              setShowAddSection(!showAddSection);
              if (!showAddSection) fetchAvailableStudents();
            }}
          >
            {showAddSection ? "Đóng tìm kiếm" : "Thêm học sinh mới"}
          </Button>
        </div>

        {showAddSection && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold mb-2">Tìm kiếm học sinh để thêm vào lớp:</p>
            <Space className="w-full mb-4">
              <Input 
                placeholder="Nhập tên, email hoặc mã học sinh..." 
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onPressEnter={() => fetchAvailableStudents(searchKeyword)}
                style={{ width: 400 }}
                suffix={<SearchOutlined className="text-gray-400" />}
              />
              <Button type="primary" onClick={() => fetchAvailableStudents(searchKeyword)}>Tìm</Button>
            </Space>
            <Table 
              size="small"
              columns={availableColumns}
              dataSource={availableStudents}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              locale={{ emptyText: 'Không tìm thấy học sinh nào' }}
            />
          </div>
        )}

        <div>
          <p className="font-semibold mb-2">Danh sách học sinh trong lớp:</p>
          <Table 
            loading={loading}
            columns={studentColumns}
            dataSource={students}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default StudentListModal;
