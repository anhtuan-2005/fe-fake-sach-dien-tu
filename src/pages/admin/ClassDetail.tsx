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
  PlusOutlined
} from '@ant-design/icons';
import api from '../../api';
import { Classroom, ApiResponse } from '../../types';
import StudentTab from './components/StudentTab';
import ClassModal from './components/ClassModal';

const { Content } = Layout;
const { Title, Text } = Typography;

interface ClassDetailProps {
  isReadOnly?: boolean;
}

const ClassDetail: React.FC<ClassDetailProps> = ({ isReadOnly = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const fetchClassDetail = useCallback(async () => {
    setLoading(true);
    try {
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
            navigate('/admin/classes');
          }
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Lỗi khi xóa lớp học');
        }
      }
    });
  };

  if (loading && !classroom) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" description="Đang tải thông tin lớp học..." />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8 text-center">
        <Title level={4}>Không tìm thấy lớp học</Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/classes')}>
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
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Title level={5}>Danh sách bài tập</Title>
            {!isReadOnly && <Button type="primary">Tạo bài tập</Button>}
          </div>
          <div className="text-center py-12 text-gray-400">
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
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Text strong>Tháng:</Text>
              {/* Select Month logic would go here */}
              <Button type="primary">Lọc</Button>
            </Space>
            <Space>
              <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
              {!isReadOnly && <Button icon={<MailOutlined />}>Gửi email kết quả</Button>}
            </Space>
          </div>
          <div className="text-center py-12 text-gray-400">
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
      children: <StudentTab classId={id!} isReadOnly={isReadOnly} />,
    },
    {
      key: '4',
      label: (
        <span>
          <NotificationOutlined /> Thông báo
        </span>
      ),
      children: (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Title level={5}>Thông báo lớp học</Title>
            {!isReadOnly && <Button type="primary">Tạo thông báo</Button>}
          </div>
          <div className="text-center py-12 text-gray-400">
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
        <Card>
          <Row gutter={24}>
            <Col span={6} className="border-r">
              <div className="flex justify-between items-center mb-4">
                <Text strong>Danh mục</Text>
                {!isReadOnly && <Button type="text" icon={<PlusOutlined />} size="small" />}
              </div>
              {/* Placeholder menu */}
              <div className="p-2 bg-gray-50 rounded">Mục rèn luyện 1</div>
            </Col>
            <Col span={18}>
              <div className="text-center py-12 text-gray-400">
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
      icon: <EditOutlined />,
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
    <Content className="p-6">
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { title: 'Quản trị', href: '/admin' },
            { title: 'Quản lý lớp học', href: '/admin/classes' },
            { title: classroom.class_name },
          ]} 
        />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/classes')}
            className="mr-4"
          />
          <div>
            <Title level={2} style={{ margin: 0 }}>{classroom.class_name}</Title>
            <Space>
              <Tag color="blue">{classroom.class_code}</Tag>
              <Tag color={classroom.status === 1 ? 'green' : 'red'}>
                {classroom.status === 1 ? 'Đang hoạt động' : 'Ngừng sử dụng'}
              </Tag>
            </Space>
          </div>
        </div>
        {!isReadOnly && (
          <Dropdown menu={{ items: moreActions }} placement="bottomRight">
            <Button icon={<MoreOutlined />} size="large" />
          </Dropdown>
        )}
      </div>

      <Card className="mb-6">
        <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}>
          <Descriptions.Item label="Mã lớp học">{classroom.class_code}</Descriptions.Item>
          <Descriptions.Item label="Tên lớp học">{classroom.class_name}</Descriptions.Item>
          <Descriptions.Item label="Sĩ số">
            <Text strong className="text-blue-600">{classroom.student_count || 0}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Giáo viên">{classroom.teacher_name || 'Chưa phân công'}</Descriptions.Item>
          <Descriptions.Item label="Điện thoại">{classroom.teacher_phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="Email">{classroom.teacher_email || '-'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={classroom.status === 1 ? 'green' : 'red'}>
              {classroom.status === 1 ? 'Đang hoạt động' : 'Ngừng sử dụng'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Hoàn thành" span={2}>
            {classroom.completion_status === 1 ? (
              <Tag color="success">Hoàn thành</Tag>
            ) : (
              <Tag color="processing">Đang học</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={3}>{classroom.description || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs 
        defaultActiveKey="3" 
        items={tabItems} 
        className="bg-white p-4 rounded-lg shadow-sm"
      />

      {isEditModalOpen && (
        <ClassModal 
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          editingClass={classroom}
        />
      )}
    </Content>
  );
};

export default ClassDetail;