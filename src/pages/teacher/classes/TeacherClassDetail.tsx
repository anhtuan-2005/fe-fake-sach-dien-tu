import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Tabs, 
  Descriptions, 
  Button, 
  Card, 
  App, 
  Breadcrumb, 
  Typography, 
  Tag, 
  Dropdown, 
  MenuProps,
  Spin,
  Row,
  Col,
  Space
} from 'antd';
import { 
  ArrowLeftOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  BookOutlined,
  LineChartOutlined,
  TeamOutlined,
  NotificationOutlined,
  ExperimentOutlined,
  MailOutlined,
  FileExcelOutlined,
  PlusOutlined,
  HomeOutlined
} from '@ant-design/icons';
import api from '../../../api';
import { Classroom, ApiResponse } from '../../../types';
import StudentTab from '../../admin/components/StudentTab';
import ClassModal from '../../admin/components/ClassModal';

const { Content } = Layout;
const { Title, Text } = Typography;

export const TeacherClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchClassDetail = useCallback(async () => {
    setLoading(true);
    try {
      // Teachers retrieve class detail from /admin/classes/:id (which is role-authorized)
      const response = await api.get<ApiResponse<Classroom>>(`/admin/classes/${id}`);
      if (response.data.success) {
        setClassroom(response.data.data || null);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải thông tin lớp học');
    } finally {
      setLoading(false);
    }
  }, [id, message]);

  useEffect(() => {
    fetchClassDetail();
  }, [fetchClassDetail]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchClassDetail();
  };

  const handleDeleteClass = () => {
    if (!classroom) return;
    
    modal.confirm({
      title: 'Xác nhận xóa lớp học',
      content: `Bạn có chắc chắn muốn xóa lớp "${classroom.class_name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await api.delete(`/admin/classes/${id}`);
          if (response.data.success) {
            message.success('Xóa lớp học thành công');
            navigate('/teacher/classes');
          }
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Lỗi khi xóa lớp học');
        }
      }
    });
  };

  if (loading && !classroom) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang tải thông tin lớp học..." />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mt-10">
        <Title level={4} className="text-gray-750">Không tìm thấy lớp học</Title>
        <p className="text-gray-500 mb-6">Lớp học không tồn tại hoặc bạn không có quyền truy cập.</p>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/teacher/classes')}
          className="rounded-lg h-10 px-6"
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <BookOutlined /> Bài tập
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} className="!m-0 text-gray-700">Danh sách bài tập</Title>
            <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 rounded-lg">
              Tạo bài tập
            </Button>
          </div>
          <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-250">
            Tính năng đang được phát triển
          </div>
        </Card>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <LineChartOutlined /> Kết quả rèn luyện
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm rounded-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Space>
              <Text strong className="text-gray-650">Tháng:</Text>
              <Button type="primary" className="rounded-lg bg-blue-600">Lọc</Button>
            </Space>
            <Space className="w-full sm:w-auto">
              <Button icon={<FileExcelOutlined />} className="flex-1 sm:flex-none rounded-lg">Xuất Excel</Button>
              <Button icon={<MailOutlined />} className="flex-1 sm:flex-none rounded-lg">Gửi email kết quả</Button>
            </Space>
          </div>
          <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-250">
            Bảng điểm đang được cập nhật
          </div>
        </Card>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <TeamOutlined /> Học sinh
        </span>
      ),
      // Pass isReadOnly={false} so teacher can manage students (add, remove, approve)
      children: <StudentTab classId={id!} isReadOnly={false} />,
    },
    {
      key: '4',
      label: (
        <span>
          <NotificationOutlined /> Thông báo
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <Title level={5} className="!m-0 text-gray-700">Thông báo lớp học</Title>
            <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 rounded-lg">
              Tạo thông báo
            </Button>
          </div>
          <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-250">
            Chưa có thông báo nào
          </div>
        </Card>
      ),
    },
    {
      key: '5',
      label: (
        <span>
          <ExperimentOutlined /> Rèn luyện, bồi dưỡng
        </span>
      ),
      children: (
        <Card className="border-0 shadow-sm rounded-xl">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={6} className="md:border-r border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <Text strong className="text-gray-750">Danh mục</Text>
                <Button type="text" icon={<PlusOutlined />} size="small" />
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 font-medium rounded-lg border border-blue-100">
                Mục rèn luyện 1
              </div>
            </Col>
            <Col xs={24} md={18}>
              <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-250">
                Chọn danh mục để xem chi tiết
              </div>
            </Col>
          </Row>
        </Card>
      ),
    },
  ];

  const moreActions: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa thông tin',
      icon: <EditOutlined className="text-blue-500" />,
      onClick: () => setIsEditModalOpen(true),
    },
    {
      key: 'delete',
      label: 'Xóa lớp học',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: handleDeleteClass,
    },
  ];

  return (
    <div className="max-w-[1250px] mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/teacher/dashboard',
            title: <><HomeOutlined /> <span>Trang chủ</span></>,
          },
          {
            href: '/teacher/classes',
            title: 'Quản lý lớp học',
          },
          {
            title: classroom.class_name,
          },
        ]}
        className="mb-6"
      />

      {/* Header section with Actions */}
      <div className="flex justify-between items-center gap-4 mb-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/teacher/classes')}
            className="flex items-center justify-center rounded-xl h-10 w-10 text-gray-500 hover:text-blue-600"
          />
          <div>
            <Title level={2} className="!m-0 text-gray-800 font-bold" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}>
              {classroom.class_name}
            </Title>
            <Space className="mt-2 flex-wrap">
              <Tag color="blue" className="rounded-full font-semibold px-3 py-0.5">Mã lớp: {classroom.class_code}</Tag>
              <Tag color={classroom.status === 1 ? 'green' : 'red'} className="rounded-full font-semibold px-3 py-0.5">
                {classroom.status === 1 ? 'Đang hoạt động' : 'Ngừng sử dụng'}
              </Tag>
              {classroom.completion_status === 1 ? (
                <Tag color="success" className="rounded-full font-semibold px-3 py-0.5">Hoàn thành</Tag>
              ) : (
                <Tag color="processing" className="rounded-full font-semibold px-3 py-0.5">Đang học</Tag>
              )}
            </Space>
          </div>
        </div>
        
        <Dropdown menu={{ items: moreActions }} placement="bottomRight" trigger={['click']}>
          <Button 
            icon={<MoreOutlined className="text-xl" />} 
            size="large" 
            className="flex items-center justify-center rounded-xl border-gray-200 hover:border-blue-500 hover:text-blue-600"
          />
        </Dropdown>
      </div>

      {/* Class Meta Descriptions */}
      <Card className="mb-6 border-0 shadow-sm rounded-2xl overflow-hidden">
        <Descriptions 
          title={<span className="text-gray-800 font-bold text-base">Thông tin chi tiết lớp học</span>} 
          bordered 
          column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
          labelStyle={{ fontWeight: '500', color: '#4b5563', backgroundColor: '#f9fafb' }}
        >
          <Descriptions.Item label="Mã lớp học">{classroom.class_code}</Descriptions.Item>
          <Descriptions.Item label="Tên lớp học">{classroom.class_name}</Descriptions.Item>
          <Descriptions.Item label="Sĩ số">
            <Text strong className="text-blue-600">{classroom.student_count || 0} học sinh</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Giáo viên">{classroom.teacher_name || 'Chưa phân công'}</Descriptions.Item>
          <Descriptions.Item label="Điện thoại">{classroom.teacher_phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Email">{classroom.teacher_email || '-'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={classroom.status === 1 ? 'green' : 'red'} className="rounded-full">
              {classroom.status === 1 ? 'Đang hoạt động' : 'Ngừng sử dụng'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Hoàn thành" span={2}>
            {classroom.completion_status === 1 ? (
              <Tag color="success" className="rounded-full">Hoàn thành</Tag>
            ) : (
              <Tag color="processing" className="rounded-full">Đang học</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={3}>{classroom.description || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Tabs Menu */}
      <Tabs 
        defaultActiveKey="3" 
        items={tabItems} 
        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 custom-teacher-tabs"
      />

      {/* Edit Modal Component */}
      {isEditModalOpen && (
        <ClassModal 
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          editingClass={classroom}
        />
      )}
    </div>
  );
};

export default TeacherClassDetail;
