import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Button, Space, Tooltip, Popconfirm, App, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReloadOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import api from '../../../api';
import { User, ApiResponse } from '../../../types';

interface UserTrashModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserTrashModal: React.FC<UserTrashModalProps> = ({ open, onCancel, onSuccess }) => {
  const { message } = App.useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTrashUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Sử dụng API getUsers với tham số showDeleted=true
      const response = await api.get<ApiResponse<User[]>>('/admin/users', {
        params: {
          showDeleted: 'true',
          limit: 100 // Lấy nhiều hơn một chút cho thùng rác
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách thùng rác');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    if (open) {
      fetchTrashUsers();
    }
  }, [open, fetchTrashUsers]);

  const handleRestore = async (id: number) => {
    try {
      const response = await api.put(`/admin/users/${id}/restore`);
      if (response.data.success) {
        message.success('Khôi phục người dùng thành công');
        fetchTrashUsers();
        onSuccess();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi khôi phục người dùng');
    }
  };

  const handleHardDelete = async (id: number) => {
    try {
      const response = await api.delete(`/admin/users/${id}/hard-delete`);
      if (response.data.success) {
        message.success('Đã xóa vĩnh viễn người dùng');
        fetchTrashUsers();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa vĩnh viễn');
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Mã HS/GV',
      dataIndex: 'user_code',
      key: 'user_code',
      width: 100,
      render: (text) => <span className="font-medium">{text || 'N/A'}</span>
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text) => <span className="font-bold">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Loại',
      dataIndex: 'account_type',
      key: 'account_type',
      render: (type) => <Tag color="default">{type}</Tag>
    },
    {
      title: 'Ngày xóa',
      dataIndex: 'deleted_at',
      key: 'deleted_at',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : 'N/A'
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Khôi phục">
            <Button 
              type="text" 
              icon={<UndoOutlined className="text-green-600" />} 
              onClick={() => handleRestore(record.id)}
            />
          </Tooltip>
          
          <Popconfirm
            title="Xóa vĩnh viễn"
            description="Hành động này không thể hoàn tác. Bạn có chắc chắn?"
            onConfirm={() => handleHardDelete(record.id)}
            okText="Xóa vĩnh viễn"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa vĩnh viễn">
              <Button 
                type="text" 
                icon={<DeleteOutlined className="text-red-500" />} 
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <DeleteOutlined />
          <span>Thùng rác người dùng</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="close" onClick={onCancel}>Đóng</Button>,
        <Button 
          key="refresh" 
          icon={<ReloadOutlined />} 
          onClick={fetchTrashUsers}
          loading={loading}
        >
          Làm mới
        </Button>
      ]}
    >
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'Thùng rác trống' }}
      />
    </Modal>
  );
};

export default UserTrashModal;
