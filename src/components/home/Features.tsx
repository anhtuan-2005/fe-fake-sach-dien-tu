import React from 'react';
import { Card, Button, Row, Col, Space } from 'antd';
import { Cpu, Users, ShieldCheck, LucideIcon } from 'lucide-react';
import './Features.css';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  buttons: string[];
  color: string;
}

const Features: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: Cpu,
      title: "CHẤM ĐIỂM AI TỰ ĐỘNG",
      description: "Việc tích hợp hệ thống AI chấm điểm giúp hạn chế việc lấy đi một khoảng thời gian đáng kể trong khi thời gian đó có thể được sử dụng để trao đổi với học sinh, chuẩn bị trang bị lớp học hay các công việc khác phục vụ thiết yếu phục vụ cho công tác dạy và học.",
      buttons: ["CÁC BÀI TRẮC NGHIỆM", "LUYỆN TẬP VỚI AI"],
      color: "#2196f3"
    },
    {
      icon: Users,
      title: "GIÁO VIÊN QUẢN LÝ HỌC SINH",
      description: "Xây dựng hệ thống quản lý lớp học từ xa. Là nơi giáo viên có thể chủ động theo dõi việc học và làm bài của học sinh từ đó giúp giáo viên có thể quản lý lớp một cách bao quát hơn. Bên cạnh đó luôn đòi hỏi học sinh làm việc khẩn trương theo đúng lộ trình giáo viên đã đặt ra.",
      buttons: ["QUẢN LÝ LỚP", "ĐÁNH GIÁ KẾT QUẢ HỌC TẬP"],
      color: "#ff9800"
    },
    {
      icon: ShieldCheck,
      title: "PHỤ HUYNH THEO DÕI HỌC SINH",
      description: "Nhu cầu theo dõi việc học tập của con cái đối với phụ huynh là một nhu cầu hàng đầu. Hệ thống được xây dựng với mục đích đáp ứng nhu cầu trên và tạo sự kết nối chặt chẽ hơn giữa phụ huynh học sinh với nhà trường để kịp thời nắm bắt và theo dõi.",
      buttons: ["THEO DÕI KẾT QUẢ HỌC TẬP"],
      color: "#7986cb"
    }
  ];

  return (
    <section className="features">
      <h2 className="features-section-title">TÍNH NĂNG NỔI BẬT</h2>
      <div className="features-container">
        <Row gutter={[32, 32]} justify="center">
          {features.map((item, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                hoverable
                className="antd-feature-card"
                cover={
                  <div className="icon-wrapper-antd" style={{ backgroundColor: item.color }}>
                    <item.icon size={32} color="white" />
                  </div>
                }
              >
                <Card.Meta
                  title={<span style={{ color: '#1e88e5', fontWeight: 700 }}>{item.title}</span>}
                  description={
                    <div className="feature-card-content">
                      <p className="feature-desc-text">{item.description}</p>
                      <Space wrap className="feature-btn-group">
                        {item.buttons.map((btn, bIndex) => (
                          <Button 
                            key={bIndex} 
                            type="primary" 
                            shape="round" 
                            style={{ backgroundColor: item.color, borderColor: item.color }}
                          >
                            {btn}
                          </Button>
                        ))}
                      </Space>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Features;
