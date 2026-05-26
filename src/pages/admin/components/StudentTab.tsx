import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Tag, Input, App, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  UserAddOutlined, 
  FileExcelOutlined, 
  DeleteOutlined, 
  CheckOutlined, 
  SearchOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import api from '../../../api';
import { ApiResponse } from '../../../types';
import AddStudentModal from './AddStudentModal';

const { Text } = Typography;

interface Student {
  id: number;
  user_code: string;
  full_name: string;
  email: string;
  phone: string;
  join_status: number;
}

interface StudentTabProps {
  classId: string | number;
  isReadOnly?: boolean;
}

const StudentTab: React.FC<StudentTabProps> = ({ classId, isReadOnly = false }) => {
  const { message, modal } = App.useApp();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const fetchStudents = useCallback(async (currentPage: number, size: number, keyword: string = '') => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<Student[]>>(`/admin/classes/${classId}/students`, {
        params: {
          page: currentPage,
          limit: size,
          keyword: keyword
        }
      });
      if (response.data.success) {
        setStudents(response.data.data || []);
        if (response.data.pagination) {
          setTotal(response.data.pagination.totalItems);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  useEffect(() => {
    fetchStudents(page, pageSize, searchKeyword);
  }, [fetchStudents, page, pageSize, searchKeyword]);

  const handleRemoveStudent = (studentId: number) => {
    modal.confirm({
      title: 'Xác nhận gỡ học sinh',
      content: 'Bạn có chắc chắn muốn gỡ học sinh này khỏi lớp? (Tài khoản học sinh vẫn sẽ được giữ lại trong hệ thống)',
      okText: 'Gỡ',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await api.delete(`/admin/classes/${classId}/students`, {
            data: { studentIds: [studentId] }
          });
          message.success('Đã gỡ học sinh khỏi lớp');
          fetchStudents(page, pageSize);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Lỗi khi gỡ học sinh');
        }
      }
    });
  };

  const handleBulkRemove = () => {
    if (selectedRowKeys.length === 0) return;

    modal.confirm({
      title: 'Xác nhận gỡ hàng loạt',
      content: `Bạn có chắc chắn muốn gỡ ${selectedRowKeys.length} học sinh đã chọn khỏi lớp?`,
      okText: 'Gỡ',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await api.delete(`/admin/classes/${classId}/students`, {
            data: { studentIds: selectedRowKeys }
          });
          message.success(`Đã gỡ ${selectedRowKeys.length} học sinh khỏi lớp`);
          setSelectedRowKeys([]);
          fetchStudents(page, pageSize);
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Lỗi khi gỡ học sinh');
        }
      }
    });
  };

  const handleBulkApprove = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      setLoading(true);
      await api.put(`/admin/classes/${classId}/students/approve`, {
        studentIds: selectedRowKeys
      });
      message.success(`Đã phê duyệt ${selectedRowKeys.length} học sinh vào lớp`);
      setSelectedRowKeys([]);
      fetchStudents(page, pageSize);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi phê duyệt học sinh');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: '#',
      key: 'index',
      width: 70,
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: 'Học sinh',
      children: [
        {
          title: 'Mã',
          dataIndex: 'user_code',
          key: 'user_code',
          width: 120,
          sorter: (a, b) => a.user_code.localeCompare(b.user_code),
          render: (text) => <Text className="text-gray-600">{text}</Text>
        },
        {
          title: 'Họ và tên',
          dataIndex: 'full_name',
          key: 'full_name',
          width: 200,
          sorter: (a, b) => a.full_name.localeCompare(b.full_name),
          render: (text) => (
            <Space>
              <UserOutlined className="text-blue-500" />
              <Text strong className="text-blue-600">{text}</Text>
            </Space>
          )
        }
      ]
    },
    {
      title: 'Thông tin liên lạc',
      children: [
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          width: 220,
          sorter: (a, b) => a.email.localeCompare(b.email),
          render: (text) => (
            <Space>
              <MailOutlined className="text-gray-400" />
              <Text>{text}</Text>
            </Space>
          )
        },
        {
          title: 'Điện thoại',
          dataIndex: 'phone',
          key: 'phone',
          width: 150,
          sorter: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
          render: (text) => (
            <Space>
              <PhoneOutlined className="text-gray-400" />
              <Text>{text || '-'}</Text>
            </Space>
          )
        }
      ]
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 150,
      render: () => <Text type="secondary">-</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'join_status',
      key: 'join_status',
      width: 150,
      render: (status) => (
        status === 1 ? (
          <Tag color="success">Đang hoạt động</Tag>
        ) : (
          <Tag color="error">Chờ phê duyệt</Tag>
        )
      )
    },
    ...(!isReadOnly ? [{
      title: 'Thực hiện',
      key: 'action',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: Student) => (
        <Button 
          type="primary" 
          danger 
          shape="circle" 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemoveStudent(record.id)}
        />
      )
    }] : [])
  ];

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <Space size="middle">
          {!isReadOnly && (
            <>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Thêm học sinh
              </Button>
              <Button icon={<FileExcelOutlined />}>Nhập học sinh</Button>
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                disabled={selectedRowKeys.length === 0}
                onClick={handleBulkRemove}
              >
                Xóa học sinh
              </Button>
              <Button 
                icon={<CheckOutlined />} 
                disabled={selectedRowKeys.length === 0}
                onClick={handleBulkApprove}
              >
                Phê duyệt
              </Button>
            </>
          )}
        </Space>
        
        <div className="flex items-center space-x-2">
          <Text type="secondary">Tìm kiếm:</Text>
          <Input 
            placeholder="Nhập tên, mã học sinh..." 
            prefix={<SearchOutlined />} 
            style={{ width: 250 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table 
          columns={columns} 
          dataSource={students}
          rowKey="id"
          loading={loading}
          rowSelection={!isReadOnly ? {
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          } : undefined}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            locale: { items_per_page: '/ trang' },
            onChange: (p, s) => {
              setPage(p);
              setPageSize(s);
            }
          }}
          bordered
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Add Student Modal */}
      <AddStudentModal 
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        classId={classId}
        onSuccess={() => fetchStudents(page, pageSize, searchKeyword)}
      />
    </div>
  );
};

export default StudentTab;