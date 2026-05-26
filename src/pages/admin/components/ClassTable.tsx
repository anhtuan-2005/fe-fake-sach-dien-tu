import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, App, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, SwapOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import { Classroom, ClassFilterState, ApiResponse } from '../../../types';
import ClassFilter from './ClassFilter';
import ClassModal from './ClassModal';
import StudentListModal from './StudentListModal';

const { Title } = Typography;

const ClassTable: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  
  // States
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filters, setFilters] = useState<ClassFilterState>({
    status: 'Tất cả',
    searchType: 'Tên lớp',
    keyword: ''
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<Classroom | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);

  // Fetch classes from API
  const fetchClasses = useCallback(async (currentPage: number, currentFilters: ClassFilterState) => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<Classroom[]>>('/admin/classes', {
        params: {
          ...currentFilters,
          page: currentPage,
          limit: 10
        }
      });
      
      if (response.data.success) {
        setClasses(response.data.data || []);
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.totalItems);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchClasses(page, filters);
  }, [page, filters, fetchClasses]);

  // Handlers
  const handleSearch = (newFilters: ClassFilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      status: 'Tất cả',
      searchType: 'Tên lớp',
      keyword: ''
    });
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/classes/${id}`);
      message.success('Xóa lớp học thành công');
      fetchClasses(page, filters);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa lớp học');
    }
  };

  const handleBulkAction = async (action: 'delete' | 'status', status?: string) => {
    try {
      await api.post('/admin/classes/bulk-action', {
        ids: selectedRowKeys,
        action,
        status
      });
      message.success('Thao tác thành công');
      setSelectedRowKeys([]);
      fetchClasses(page, filters);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi thực hiện thao tác');
    }
  };

  const handleOpenAddModal = () => {
    setEditingClass(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: Classroom) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const handleOpenStudentModal = (cls: Classroom) => {
    setSelectedClass(cls);
    setIsStudentModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchClasses(page, filters);
  };

  // Columns definition
  const columns: ColumnsType<Classroom> = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (page - 1) * 10 + index + 1
    },
    {
      title: 'Mã lớp',
      dataIndex: 'class_code',
      key: 'class_code',
      width: 120,
      render: (text) => <span className="font-medium text-blue-600">{text}</span>
    },
    {
      title: 'Tên lớp',
      dataIndex: 'class_name',
      key: 'class_name',
      width: 200,
      render: (text, record) => (
        <Button 
          type="link" 
          className="p-0 font-bold text-blue-600 hover:text-blue-800"
          onClick={() => navigate(`/admin/classes/${record.id}`)}
        >
          {text}
        </Button>
      )
    },
    {
      title: 'Sĩ số',
      dataIndex: 'student_count',
      key: 'student_count',
      width: 100,
      align: 'right',
      render: (count) => <span className="font-bold text-blue-600">{count || 0}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'} className="rounded-full">
          {status === 1 ? 'Đang dùng' : 'Ngừng sử dụng'}
        </Tag>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (text) => <span className="text-gray-500">{text || '-'}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/admin/classes/${record.id}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ], [page, navigate]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-full sm:w-auto overflow-hidden">
          <Title 
            level={3} 
            className="!m-0 text-gray-800"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
          >
            Quản lý lớp học
          </Title>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Danh sách các lớp học trong hệ thống</p>
        </div>
        <Space size="small" className="w-full sm:w-auto flex-wrap">
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => fetchClasses(page, filters)}
            loading={loading}
            className="flex-1 sm:flex-none h-10 rounded-lg font-medium"
          >
            Làm mới
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none h-10 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md"
          >
            Thêm lớp học
          </Button>
        </Space>
      </div>

      {/* Filter Component */}
      <ClassFilter 
        filters={filters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
          <span className="text-blue-700 font-medium">
            Đang chọn {selectedRowKeys.length} lớp học
          </span>
          <Space>
            <Button 
              icon={<SwapOutlined />} 
              onClick={() => handleBulkAction('status', 'Đang dùng')}
              className="text-green-600 border-green-200 hover:text-green-700 hover:border-green-300"
            >
              Chuyển trạng thái: Đang dùng
            </Button>
            <Button 
              icon={<SwapOutlined />} 
              onClick={() => handleBulkAction('status', 'Ngừng sử dụng')}
              className="text-orange-600 border-orange-200 hover:text-orange-700 hover:border-orange-300"
            >
              Chuyển trạng thái: Ngừng sử dụng
            </Button>
          </Space>
        </div>
      )}

      {/* Table Component */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={classes}
          rowKey="id"
          loading={loading}
          pagination={{
            current: page,
            pageSize: 10,
            total: totalItems,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            align: 'end',
            className: "p-4 border-t border-gray-50"
          }}
          scroll={{ x: 'max-content' }}
          className="custom-ant-table"
        />
      </div>

      {/* Modal Component */}
      <ClassModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        editingClass={editingClass}
      />

      {/* Student Management Modal */}
      <StudentListModal
        open={isStudentModalOpen}
        onCancel={() => setIsStudentModalOpen(false)}
        classroom={selectedClass}
        onUpdateCount={() => fetchClasses(page, filters)}
      />
    </div>
  );
};

export default ClassTable;
