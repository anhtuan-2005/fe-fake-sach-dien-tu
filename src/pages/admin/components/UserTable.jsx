import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, Tooltip, App } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import api from '../../../api';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      if (response.data.success) {
        const formattedData = response.data.data.map((user, index) => ({
          key: user.id || index,
          user_code: user.user_code,
          full_name: user.full_name,
          account_type: user.account_type,
          level: user.level,
          email: user.email,
          phone: user.phone,
        }));
        setUsers(formattedData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể kết nối với máy chủ để lấy dữ liệu người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'user_code',
      key: 'user_code',
      width: 120,
      render: (text) => <span className="font-medium text-blue-600">{text}</span>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text) => (
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
      render: (type) => {
        const color = type === 'Giáo viên' ? 'orange' : 'blue';
        return <Tag color={color} className="rounded-md px-3">{type}</Tag>;
      },
    },
    {
      title: 'Cấp',
      dataIndex: 'level',
      key: 'level',
      render: (level) => <Tag className="border-blue-200 text-blue-600 bg-blue-50">{level}</Tag>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span className="text-blue-500 underline text-xs">{email}</span>
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone ? (
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
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              className="hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              className="hover:bg-red-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Danh sách người dùng</h3>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          loading={loading}
          type="ghost"
        >
          Làm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          pageSize: 10,
          placement: 'bottomRight',
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