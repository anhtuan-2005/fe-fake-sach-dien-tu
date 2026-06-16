import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { BookOutlined, TeamOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import useAuthStore from '../../store/useAuthStore';

const { Title, Paragraph } = Typography;

export const TeacherDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-[1200px] mx-auto">
      <Card className="mb-6 border-0 shadow-sm rounded-2xl p-4 bg-gradient-to-r from-orange-50 to-amber-50">
        <Title level={2} className="text-orange-800 font-bold m-0">
          Chào mừng Thầy/Cô, {user?.full_name}!
        </Title>
        <Paragraph className="text-gray-500 m-0 mt-2 text-base">
          Đây là bảng điều khiển dành cho Giáo viên. Thầy/Cô có thể quản lý lớp học học sinh và biên soạn ngân hàng câu hỏi phục vụ giảng dạy.
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <Statistic 
              title="Lớp học đang phụ trách" 
              value={3} 
              prefix={<BookOutlined className="text-orange-500 mr-2" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <Statistic 
              title="Tổng số học sinh" 
              value={42} 
              prefix={<TeamOutlined className="text-blue-500 mr-2" />} 
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
            <Statistic 
              title="Câu hỏi biên soạn" 
              value={15} 
              prefix={<QuestionCircleOutlined className="text-green-500 mr-2" />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;
