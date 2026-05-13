import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Table, Tag, Space, Button, Tooltip, App } from 'antd';
import type { TableProps } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import api from '../../../api';
import { ApiResponse, User } from '../../../types';

/**
 * Interface mở rộng từ User để phù hợp với hiển thị Table
 */
interface UserDataType extends User {
  key: number;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { message } = App.useApp();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<User[]>>('/admin/users');
      if (response.data.success && response.data.data) {
        const formattedData: UserDataType[] = response.data.data.map((user) => ({
          ...user,
          key: user.id,
        }));
        setUsers(formattedData);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      message.error('Không thể kết nối với máy chủ để lấy dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = useMemo<TableProps<UserDataType>['columns']>(() => [
    {
      title: 'Mã',
      dataIndex: 'user_code',
      key: 'user_code',
      width: 120,
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
      width: 100,
      fixed: 'right',
      render: (_, record: UserDataType) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              className="hover:bg-blue-50"
              onClick={() => console.log('Edit', record.id)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              className="hover:bg-red-50"
              onClick={() => console.log('Delete', record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ], []);

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
