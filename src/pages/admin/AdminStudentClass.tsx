import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Table, Space, Typography, Tag, App, Row, Col, Tooltip } from 'antd';
import { TeamOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { ApiResponse } from '../../types';

const { Title, Text } = Typography;

interface StudentClass {
  id: number;
  class_code: string;
  class_name: string;
  description: string | null;
  student_count: number;
  join_status: number; // 0: Chưa xác nhận, 1: Đã xác nhận
}

const AdminStudentClass: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  
  // States
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const [joining, setJoining] = useState<boolean>(false);

  const fetchJoinedClasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse<StudentClass[]>>('/admin/student-classes');
      if (response.data.success) {
        setClasses(response.data.data || []);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải danh sách lớp học');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchJoinedClasses();
  }, [fetchJoinedClasses]);

  const handleJoinClass = async () => {
    if (!joinCode.trim()) {
      message.warning('Vui lòng nhập mã lớp học');
      return;
    }

    setJoining(true);
    try {
      const response = await api.post<ApiResponse>('/admin/student-classes/join', {
        classCode: joinCode.trim()
      });
      
      if (response.data.success) {
        message.success(response.data.message);
        setJoinCode('');
        fetchJoinedClasses();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi tham gia lớp học');
    } finally {
      setJoining(false);
    }
  };

  const columns: ColumnsType<StudentClass> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Mã lớp',
      dataIndex: 'class_code',
      key: 'class_code',
      width: 150,
      render: (text) => <Text strong className="text-blue-600">{text}</Text>
    },
    {
      title: 'Tên lớp',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (text) => (
        <Space>
          <TeamOutlined className="text-gray-400" />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Sĩ số',
      dataIndex: 'student_count',
      key: 'student_count',
      width: 100,
      align: 'center',
      render: (count) => <Text>{count || 0}</Text>
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => <Text type="secondary">{text || '-'}</Text>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'join_status',
      key: 'join_status',
      width: 150,
      render: (status) => (
        status === 1 ? (
          <Tag icon={<CheckCircleOutlined />} color="success" className="px-2 py-0.5">
            Đã xác nhận
          </Tag>
        ) : (
          <Tag icon={<ClockCircleOutlined />} color="error" className="px-2 py-0.5">
            Chưa xác nhận
          </Tag>
        )
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết lớp học">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/admin/student-classes/${record.id}`)}
            disabled={record.join_status === 0}
          />
        </Tooltip>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Khối tham gia lớp học */}
      <Card 
        title={
          <Space>
            <BookOutlined className="text-blue-600" />
            <span>Tham gia lớp học</span>
          </Space>
        }
        className="shadow-sm border-gray-100 rounded-lg"
      >
        <div className="flex items-center space-x-4">
          <Text strong>Mã lớp học:</Text>
          <Input 
            placeholder="Nhập mã lớp (VD: CL1234)" 
            style={{ width: 250 }}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            onPressEnter={handleJoinClass}
            size="middle"
            className="rounded-md"
          />
          <Button 
            type="primary" 
            onClick={handleJoinClass} 
            loading={joining}
            className="bg-blue-600 rounded-md"
          >
            Xác nhận
          </Button>
        </div>
      </Card>

      {/* Khối danh sách lớp học */}
      <Card 
        title={
          <Space>
            <TeamOutlined className="text-blue-600" />
            <span>Danh sách lớp học đã tham gia</span>
          </Space>
        }
        className="shadow-sm border-gray-100 rounded-lg"
      >
        <Table 
          columns={columns} 
          dataSource={classes}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            locale: { items_per_page: '/ trang' }
          }}
          bordered
          className="rounded-lg overflow-hidden"
        />
      </Card>
    </div>
  );
};

export default AdminStudentClass;