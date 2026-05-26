import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Space, Tooltip, Popconfirm, App, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, UserAddOutlined, ReloadOutlined, HistoryOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import { User, UserFilterState, ApiResponse } from '../../../types';
import UserFilter from './UserFilter';
import UserModal from './UserModal';
import UserTrashModal from './UserTrashModal';

const { Title } = Typography;

const UserTable: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  
  // States
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [filters, setFilters] = useState<UserFilterState>({
    role: 'all',
    level: 'all',
    province: 'all',
    district: 'all',
    school: '',
    phone: '',
    email: ''
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users from API
  const fetchUsers = useCallback(async (currentPage: number, currentFilters: UserFilterState) => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<User[]>>('/admin/users', {
        params: {
          ...currentFilters,
          page: currentPage,
          limit: 10
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data || []);
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.totalItems);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchUsers(page, filters);
  }, [page, filters, fetchUsers]);

  // Handlers
  const handleSearch = (newFilters: UserFilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    const defaultFilters: UserFilterState = {
      role: 'all',
      level: 'all',
      province: 'all',
      district: 'all',
      school: '',
      phone: '',
      email: ''
    };
    setFilters(defaultFilters);
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/users/${id}`);
      message.success('Xóa người dùng thành công');
      fetchUsers(page, filters);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
    }
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchUsers(page, filters);
  };

  // Columns definition
  const columns: ColumnsType<User> = useMemo(() => [
    {
      title: 'Mã người dùng',
      dataIndex: 'user_code',
      key: 'user_code',
      width: 120,
      render: (text) => <span className="font-medium text-blue-600">{text || 'N/A'}</span>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 200,
      render: (text) => <span className="font-bold text-gray-700">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (text) => <span className="text-gray-600">{text}</span>
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'account_type',
      key: 'account_type',
      width: 140,
      render: (type) => {
        let color = 'blue';
        if (type === 'Admin') color = 'red';
        if (type === 'Giáo viên') color = 'orange';
        return <Tag color={color} className="px-3 py-0.5 rounded-full font-medium">{type}</Tag>;
      }
    },
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (level) => <Tag color="cyan" className="rounded-md">{level || 'N/A'}</Tag>
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (text) => <span className="text-gray-500">{text || 'N/A'}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        const isAdminTốiCao = record.email === 'testitdn@gmail.com';
        const isAdmin = record.account_type === 'Admin';
        
        return (
          <Space size="middle">
            {!isAdmin && (
              <Tooltip title="Chỉnh sửa">
                <Button 
                  type="text" 
                  icon={<EditOutlined className="text-blue-500 text-lg" />} 
                  onClick={() => handleOpenEditModal(record)}
                  className="hover:bg-blue-50 rounded-full"
                />
              </Tooltip>
            )}
            
            {!isAdminTốiCao && !isAdmin && (
              <Popconfirm
                title="Xóa người dùng"
                description="Bạn có chắc chắn muốn xóa người dùng này?"
                onConfirm={() => handleDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Xóa">
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined className="text-red-500 text-lg" />} 
                    className="hover:bg-red-50 rounded-full"
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ], [page, filters]);

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="w-full sm:w-auto overflow-hidden">
          <Title 
            level={3} 
            className="!m-0 text-gray-800 break-words whitespace-normal"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
          >
            Quản lý người dùng
          </Title>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Danh sách tất cả người dùng trong hệ thống</p>
        </div>
        <Space size="small" className="w-full sm:w-auto flex-wrap">
          <Button 
            type="default" 
            icon={<HistoryOutlined />} 
            className="flex-1 sm:flex-none h-10 rounded-lg font-medium text-xs sm:text-sm text-gray-500 border-gray-200"
            onClick={() => navigate('/admin/logs')}
          >
            Lịch sử thao tác
          </Button>
          <Button 
            icon={<UploadOutlined />} 
            className="flex-1 sm:flex-none h-10 rounded-lg font-medium text-xs sm:text-sm text-gray-600 border-gray-300"
          >
            Nhập từ excel
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => fetchUsers(page, filters)}
            loading={loading}
            className="flex-1 sm:flex-none h-10 rounded-lg font-medium text-xs sm:text-sm"
          >
            Làm mới
          </Button>
          <Button 
            type="default"
            danger
            icon={<DeleteOutlined />} 
            onClick={() => setIsTrashModalOpen(true)}
            className="flex-1 sm:flex-none h-10 rounded-lg font-medium text-xs sm:text-sm"
          >
            Thùng rác
          </Button>
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none h-10 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md text-xs sm:text-sm"
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      {/* Filter Component */}
      <UserFilter 
        filters={filters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Table Component */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={users}
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
      <UserModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        editingUser={editingUser}
      />

      {/* Trash Modal */}
      <UserTrashModal
        open={isTrashModalOpen}
        onCancel={() => setIsTrashModalOpen(false)}
        onSuccess={() => fetchUsers(page, filters)}
      />
    </div>
  );
};

export default UserTable;
