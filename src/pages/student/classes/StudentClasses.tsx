import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Table, Input, Button, Breadcrumb, Space, Tag, Typography, App, Row, Col } from 'antd';
import { HomeOutlined, SearchOutlined, CheckOutlined, ReloadOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../../api';
import { Classroom, ApiResponse } from '../../../types';

const { Title, Text } = Typography;

export const StudentClasses: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  
  // States cho form tham gia lớp
  const [classCodeInput, setClassCodeInput] = useState<string>('');

  // States cho bộ lọc tìm kiếm tại client (hoặc gọi API)
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  // Gọi API lấy danh sách lớp học học sinh đã tham gia
  const fetchJoinedClasses = useCallback(async () => {
    setLoading(true);
    try {
      // API của học sinh lấy các lớp đã tham gia: GET /api/admin/student-classes
      // Nhìn vào backend routes:
      // router.get('/student-classes', checkRole(['admin', 'teacher', 'student']), classController.getJoinedClasses);
      // Mounted dưới app.use('/api/admin', adminRoutes);
      // Nên endpoint thực tế là: GET /api/admin/student-classes
      const response = await api.get<ApiResponse<Classroom[]>>('/admin/student-classes');
      if (response.data && response.data.success) {
        setClasses(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Lỗi khi fetch lớp học đã tham gia:', error);
      message.error(error.response?.data?.message || 'Không thể tải danh sách lớp học của bạn.');
    } finally {
      setLoading(false);
    }
  }, [message]);

  useEffect(() => {
    fetchJoinedClasses();
  }, [fetchJoinedClasses]);

  // Xử lý tham gia lớp học bằng code
  const handleJoinClass = async () => {
    if (!classCodeInput.trim()) {
      message.warning('Vui lòng nhập mã lớp học!');
      return;
    }

    setJoinLoading(true);
    try {
      // API tham gia lớp học: POST /api/admin/student-classes/join
      const response = await api.post<ApiResponse>('/admin/student-classes/join', {
        classCode: classCodeInput.trim()
      });

      if (response.data && response.data.success) {
        message.success(response.data.message || 'Tham gia lớp học thành công!');
        setClassCodeInput('');
        fetchJoinedClasses(); // Load lại danh sách lớp học
      } else {
        message.error(response.data.message || 'Mã lớp không chính xác hoặc bạn đã tham gia lớp này.');
      }
    } catch (error: any) {
      console.error('Lỗi khi tham gia lớp học:', error);
      message.error(error.response?.data?.message || 'Tham gia lớp học thất bại. Vui lòng kiểm tra lại mã lớp.');
    } finally {
      setJoinLoading(false);
    }
  };

  // Cấu hình các cột của Table
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'Mã lớp',
      dataIndex: 'class_code',
      key: 'class_code',
      width: 120,
      render: (text: string) => <span className="font-medium text-blue-600">{text}</span>
    },
    {
      title: 'Tên lớp học',
      dataIndex: 'class_name',
      key: 'class_name',
      width: 220,
      render: (text: string) => <span className="font-bold text-gray-700">{text}</span>
    },
    {
      title: 'Giáo viên phụ trách',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
      width: 180,
      render: (text: string) => (
        <span>
          <UserOutlined className="mr-2 text-gray-400" />
          {text || 'Chưa phân công'}
        </span>
      )
    },
    {
      title: 'Sĩ số lớp',
      dataIndex: 'student_count',
      key: 'student_count',
      width: 100,
      align: 'right' as const,
      render: (count: number) => <span className="font-semibold text-gray-600">{count || 0} học sinh</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: number) => (
        <Tag color={status === 1 ? 'green' : 'red'} className="rounded-full font-medium px-3 py-0.5">
          {status === 1 ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (text: string) => <span className="text-gray-400">{text || '-'}</span>
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: Classroom) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/student/classes/${record.id}`)}
          className="font-semibold text-emerald-600 hover:text-emerald-700 p-0"
        >
          Xem chi tiết
        </Button>
      )
    }
  ];

  // Thực hiện lọc dữ liệu lớp học tại Client để tối ưu trải nghiệm
  const filteredClasses = classes.filter((cls) => {
    const matchesKeyword = cls.class_name.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          cls.class_code.toLowerCase().includes(searchKeyword.toLowerCase());
    
    if (statusFilter === 'Tất cả') return matchesKeyword;
    const statusValue = statusFilter === 'Đang hoạt động' ? 1 : 0;
    return matchesKeyword && cls.status === statusValue;
  });

  return (
    <div className="max-w-[1250px] mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/',
            title: <HomeOutlined />,
          },
          {
            title: 'Lớp học của tôi',
          },
        ]}
        className="mb-6"
      />

      {/* Header Title */}
      <div className="mb-6">
        <Title level={2} className="text-gray-800 font-bold m-0">
          Lớp học của tôi
        </Title>
        <p className="text-gray-500 m-0 mt-1">Quản lý và theo dõi các lớp học bạn đã tham gia.</p>
      </div>

      {/* Section 1: Join Class Code Box */}
      <Card 
        className="mb-6 border-0 shadow-sm rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50"
        title={<span className="font-bold text-blue-800">Tham gia lớp học mới</span>}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <p className="text-gray-600 m-0">
              Nhập mã lớp học (được cung cấp bởi giáo viên của bạn) để tham gia vào lớp học trực tuyến và nhận bài tập.
            </p>
          </Col>
          <Col xs={24} md={8}>
            <Space.Compact className="w-full">
              <Input 
                placeholder="Nhập mã lớp học (vd: L01)" 
                value={classCodeInput}
                onChange={(e) => setClassCodeInput(e.target.value)}
                disabled={joinLoading}
                className="h-10 rounded-l-lg border-gray-300"
                onPressEnter={handleJoinClass}
              />
              <Button 
                type="primary" 
                icon={<CheckOutlined />} 
                loading={joinLoading}
                onClick={handleJoinClass}
                className="bg-blue-600 hover:bg-blue-700 border-none h-10 px-6 rounded-r-lg font-semibold"
              >
                Tham gia
              </Button>
            </Space.Compact>
          </Col>
        </Row>
      </Card>

      {/* Section 2: Filters and Lists */}
      <Card className="border-0 shadow-sm rounded-2xl">
        {/* Simple Filters inside card */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Input
              placeholder="Tìm kiếm theo mã hoặc tên lớp..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="max-w-md h-10 rounded-lg"
              allowClear
            />
            <Button
              type={statusFilter === 'Tất cả' ? 'primary' : 'default'}
              onClick={() => setStatusFilter('Tất cả')}
              className={`h-10 rounded-lg ${statusFilter === 'Tất cả' ? 'bg-blue-600 border-none' : ''}`}
            >
              Tất cả
            </Button>
            <Button
              type={statusFilter === 'Đang hoạt động' ? 'primary' : 'default'}
              onClick={() => setStatusFilter('Đang hoạt động')}
              className={`h-10 rounded-lg ${statusFilter === 'Đang hoạt động' ? 'bg-blue-600 border-none' : ''}`}
            >
              Đang hoạt động
            </Button>
            <Button
              type={statusFilter === 'Ngừng hoạt động' ? 'primary' : 'default'}
              onClick={() => setStatusFilter('Ngừng hoạt động')}
              className={`h-10 rounded-lg ${statusFilter === 'Ngừng hoạt động' ? 'bg-blue-600 border-none' : ''}`}
            >
              Ngừng hoạt động
            </Button>
          </div>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchJoinedClasses}
            loading={loading}
            className="h-10 rounded-lg flex items-center justify-center font-medium"
          >
            Làm mới
          </Button>
        </div>

        {/* Classes Table */}
        <Table
          columns={columns}
          dataSource={filteredClasses}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 10,
            align: 'end',
            showSizeChanger: false,
            className: "pt-4"
          }}
          className="student-classes-table border border-gray-50 rounded-xl overflow-hidden"
        />
      </Card>
      
      <style>{`
        .student-classes-table .ant-table-thead > tr > th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          border-bottom: 1px solid #f1f5f9;
        }
        .student-classes-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
        }
        .student-classes-table .ant-table-tbody > tr:hover > td {
          background: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default StudentClasses;
