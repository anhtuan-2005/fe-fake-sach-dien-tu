import React, { useEffect, useState, useCallback } from 'react';
import { Table, Tag, Typography, Input, Select, DatePicker, Row, Col, Button, Card, Space, Modal, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ReloadOutlined, HistoryOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api';
import { ActivityLog, ApiResponse } from '../../types';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * Mapping tên trường dữ liệu sang tiếng Việt
 */
const FIELD_LABELS: Record<string, string> = {
  full_name: 'Họ và tên',
  email: 'Email',
  phone: 'Số điện thoại',
  account_type: 'Loại tài khoản',
  level: 'Cấp học',
  user_code: 'Mã người dùng',
  password: 'Mật khẩu',
  status: 'Trạng thái',
  province_id: 'ID Tỉnh',
  ward_id: 'ID Phường/Xã',
  school_id: 'ID Trường',
  role: 'Quyền (Role)',
  avatar_url: 'Ảnh đại diện'
};

interface DiffItem {
  key: string;
  field: string;
  oldValue: any;
  newValue: any;
}

const ActivityLogs: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Filter states
  const [action, setAction] = useState<string>('all');
  const [searchEmail, setSearchEmail] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const fetchLogs = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        action: action !== 'all' ? action : undefined,
        searchEmail: searchEmail || undefined,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      };

      const response = await api.get<ApiResponse<ActivityLog[]>>('/admin/activity-logs', { params });
      
      if (response.data.success && response.data.data) {
        setLogs(response.data.data);
        if (response.data.pagination) {
          setTotalItems(response.data.pagination.totalItems);
          setCurrentPage(response.data.pagination.currentPage);
        }
      }
    } catch (error) {
      console.error('Fetch logs error:', error);
    } finally {
      setLoading(false);
    }
  }, [action, searchEmail, dateRange]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleReset = () => {
    setAction('all');
    setSearchEmail('');
    setDateRange(null);
    fetchLogs(1);
  };

  /**
   * Hàm helper bóc tách sự thay đổi giữa old_values và new_values
   */
  const getDiffData = (log: ActivityLog): DiffItem[] => {
    if (!log.new_values) return [];
    
    try {
      // Backend có thể trả về object hoặc string JSON tùy cấu hình driver
      const oldVals = typeof log.old_values === 'string' ? JSON.parse(log.old_values) : (log.old_values || {});
      const newVals = typeof log.new_values === 'string' ? JSON.parse(log.new_values) : log.new_values;

      const diff: DiffItem[] = [];
      
      Object.keys(newVals).forEach((key) => {
        // Chỉ lấy những trường có sự thay đổi
        if (newVals[key] !== oldVals[key] && key !== 'updated_at' && key !== 'created_at') {
          diff.push({
            key,
            field: FIELD_LABELS[key] || key,
            oldValue: oldVals[key],
            newValue: newVals[key]
          });
        }
      });

      return diff;
    } catch (e) {
      console.error('Error parsing JSON diff:', e);
      return [];
    }
  };

  const handleViewDetail = (log: ActivityLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<ActivityLog> = [
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'user_email',
      key: 'user_email',
      render: (email: string) => <Text strong>{email || 'Hệ thống'}</Text>,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (act: string) => {
        let color = 'blue';
        if (act === 'CREATE') color = 'green';
        if (act === 'UPDATE') color = 'blue';
        if (act === 'DELETE') color = 'red';
        return <Tag color={color} className="font-bold">{act}</Tag>;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thao tác',
      key: 'detail',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Xem chi tiết thay đổi">
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewDetail(record)}
            disabled={record.action !== 'UPDATE'}
          >
            Chi tiết
          </Button>
        </Tooltip>
      )
    }
  ];

  // Cột cho bảng chi tiết trong Modal
  const detailColumns = [
    {
      title: 'ID',
      key: 'logId',
      width: 70,
      render: () => selectedLog?.id
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 110,
      render: () => <Tag color="blue">Cập nhật</Tag>
    },
    {
      title: 'Người dùng',
      key: 'user',
      render: () => selectedLog?.user_email
    },
    {
      title: 'Ngày sửa đổi',
      key: 'date',
      width: 170,
      render: () => dayjs(selectedLog?.created_at).format('DD/MM/YYYY HH:mm:ss')
    },
    {
      title: 'Trường',
      dataIndex: 'field',
      key: 'field',
      render: (text: string) => <Text strong className="text-blue-600">{text}</Text>
    },
    {
      title: 'Giá trị cũ',
      dataIndex: 'oldValue',
      key: 'oldValue',
      render: (val: any) => <Text delete type="secondary">{val === null || val === undefined ? 'NULL' : String(val)}</Text>
    },
    {
      title: 'Giá trị mới',
      dataIndex: 'newValue',
      key: 'newValue',
      render: (val: any) => <Text strong className="text-green-600">{val === null || val === undefined ? 'NULL' : String(val)}</Text>
    }
  ];

  return (
    <div className="p-6">
      <Card className="mb-6 shadow-sm border-none">
        <Space orientation="vertical" size="large" className="w-full">
          <div className="flex items-center gap-3">
            <Tooltip title="Quay lại Quản lý người dùng">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate('/admin/users')} 
                className="text-lg text-gray-600 hover:text-blue-600 -ml-2"
              />
            </Tooltip>
            <div className="p-2 bg-blue-50 rounded-lg">
              <HistoryOutlined className="text-2xl text-blue-600" />
            </div>
            <div>
              <Title level={4} className="!m-0">Nhật ký hoạt động</Title>
              <Text type="secondary">Theo dõi và quản lý lịch sử thao tác của quản trị viên</Text>
            </div>
          </div>

          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12} md={5}>
              <Text strong className="block mb-2">Hành động</Text>
              <Select 
                className="w-full" 
                value={action} 
                onChange={setAction}
                options={[
                  { value: 'all', label: 'Tất cả hành động' },
                  { value: 'CREATE', label: 'CREATE (Thêm mới)' },
                  { value: 'UPDATE', label: 'UPDATE (Cập nhật)' },
                  { value: 'DELETE', label: 'DELETE (Xóa)' },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Text strong className="block mb-2">Email</Text>
              <Input 
                placeholder="Tìm theo email..." 
                prefix={<SearchOutlined className="text-gray-400" />} 
                value={searchEmail}
                onChange={e => setSearchEmail(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Text strong className="block mb-2">Khoảng thời gian</Text>
              <RangePicker 
                className="w-full" 
                value={dateRange}
                onChange={(val: any) => setDateRange(val)}
                format="DD/MM/YYYY"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </Col>
            <Col xs={24} sm={24} md={5}>
              <Space className="w-full">
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={() => fetchLogs(1)}
                  loading={loading}
                  className="bg-blue-600"
                >
                  Tìm kiếm
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleReset}
                  disabled={loading}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      <Card className="shadow-sm border-none" styles={{ body: { padding: 0 } }}>
        <Table 
          columns={columns} 
          dataSource={logs} 
          rowKey="id" 
          loading={loading}
          pagination={{
            current: currentPage,
            total: totalItems,
            pageSize: 5,
            onChange: (page) => fetchLogs(page),
            showTotal: (total) => `Tổng cộng ${total} bản ghi`,
            align: 'end',
            className: "p-4"
          }}
        />
      </Card>

      {/* Modal Chi tiết thay đổi */}
      <Modal
        title={
          <Space>
            <HistoryOutlined className="text-blue-600" />
            <span>Chi tiết thay đổi dữ liệu</span>
          </Space>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>
            Đóng
          </Button>
        ]}
        width={1000}
        centered
      >
        {selectedLog && (
          <div className="py-2">
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Row gutter={24}>
                <Col span={12}>
                  <Text type="secondary">Mô tả: </Text>
                  <Text strong>{selectedLog.description}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Địa chỉ IP: </Text>
                  <Text strong>{selectedLog.ip_address || 'N/A'}</Text>
                </Col>
              </Row>
            </div>
            
            <Table
              dataSource={getDiffData(selectedLog)}
              columns={detailColumns}
              pagination={false}
              bordered
              size="small"
              className="mt-2"
              locale={{ emptyText: 'Không có dữ liệu thay đổi cụ thể hoặc log này không phải là UPDATE' }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivityLogs;
