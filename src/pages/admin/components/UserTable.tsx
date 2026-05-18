import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Table, Tag, Space, Button, Tooltip, App, Modal, Popconfirm } from 'antd';
import type { TableProps } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  ReloadOutlined,
  UndoOutlined
} from '@ant-design/icons';
import api from '../../../api';
import { ApiResponse, User, UserFilterState } from '../../../types';
import useAuthStore from '../../../store/useAuthStore';

/**
 * Interface mở rộng từ User để phù hợp với hiển thị Table
 */
interface UserDataType extends User {
  key: number;
}

interface UserTableProps {
  filters: UserFilterState;
  showDeleted?: boolean;
  onEdit?: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ filters, showDeleted = false, onEdit }) => {
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { message } = App.useApp();
  const currentUser = useAuthStore((state) => state.user);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<User[]>>('/admin/users', {
        params: { ...filters, showDeleted }
      });
      if (response.data.success && response.data.data) {
        const formattedData: UserDataType[] = response.data.data.map((user) => ({
          ...user,
          key: user.id,
        }));
        setUsers(formattedData);
      }
    } catch (error: any) {
      console.error('>>> UserTable Error:', error);
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      message.error(serverMessage ? `Lỗi từ Server: ${serverMessage}` : 'Không thể kết nối với máy chủ hoặc lỗi mạng');
    } finally {
      setLoading(false);
    }
  }, [message, filters, showDeleted]);

  useEffect(() => {
    fetchUsers();
  }, [JSON.stringify(filters), showDeleted]);

  const handleSoftDelete = async (id: number) => {
    if (currentUser && currentUser.id === id) {
      message.warning('Bạn không thể tự xóa tài khoản của chính mình');
      return;
    }

    try {
      await api.delete(`/admin/users/${id}`);
      message.success('Đã chuyển người dùng vào thùng rác');
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/restore`);
      message.success('Khôi phục người dùng thành công');
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi khôi phục');
    }
  };

  const columns = useMemo<TableProps<UserDataType>['columns']>(() => [
    {
      title: 'Mã',
      dataIndex: 'user_code',
      key: 'user_code',
      width: 100,
      render: (text: string | null) => <span className="font-medium text-blue-600">{text || 'N/A'}</span>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string) => (
        <Space>
          <UserOutlined className="text-gray-400" />
          <span className="font-semibold text-gray-700">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Loại tài khoản',
      dataIndex: 'account_type',
      key: 'account_type',
      render: (type: string | null) => {
        const color = type?.toLowerCase() === 'admin' ? 'red' : (type === 'Giáo viên' ? 'orange' : 'blue');
        return <Tag color={color} className="rounded-md px-3">{type || 'N/A'}</Tag>;
      },
    },
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
      render: (level: string | null) => <Tag className="border-blue-200 text-blue-600 bg-blue-50">{level || 'N/A'}</Tag>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => <span className="text-blue-500 underline text-xs">{email}</span>
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) => phone ? (
        <Space className="text-gray-500 text-xs">
          <PhoneOutlined />
          <span>{phone}</span>
        </Space>
      ) : <span className="text-gray-300 italic text-xs">Chưa cập nhật</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record: UserDataType) => (
        <Space size="small">
          {!showDeleted ? (
            <>
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="text"
                  icon={<EditOutlined className="text-blue-500" />}
                  onClick={() => onEdit?.(record)}
                />
              </Tooltip>
              <Popconfirm
                title="Xóa người dùng"
                description="Bạn có chắc chắn muốn chuyển người dùng này vào thùng rác?"
                onConfirm={() => handleSoftDelete(record.id)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Xóa">
                  <Button
                    type="text"
                    icon={<DeleteOutlined className="text-red-500" />}
                  />
                </Tooltip>
              </Popconfirm>
            </>
          ) : (
            <Tooltip title="Khôi phục">
              <Button
                type="text"
                icon={<UndoOutlined className="text-green-500" />}
                onClick={() => handleRestore(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ], [showDeleted, onEdit, currentUser]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Danh sách người dùng</h3>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          loading={loading}
          ghost
          type="primary"
        >
          Làm mới
        </Button>
      </div>
      <Table<UserDataType>
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          align: 'end',
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} người dùng`
        }}
        scroll={{ x: 800 }}
        className="custom-table"
      />
    </div>
  );
};

export default UserTable;
