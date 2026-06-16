import React from 'react';
import { Row, Col, Select, Input, Button, Card, Form, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface QuestionFilterProps {
  onSearch: (values: any) => void;
  onReset: () => void;
}

export const QuestionFilter: React.FC<QuestionFilterProps> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    // Loại bỏ các trường undefined hoặc rỗng
    const cleanedValues: any = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined && values[key] !== '') {
        cleanedValues[key] = values[key];
      }
    });
    onSearch(cleanedValues);
  };

  const handleResetClick = () => {
    form.resetFields();
    onReset();
  };

  // Mock data cho dropdown theo ảnh chụp hệ thống
  const skills = ['Vocabulary & Structures', 'Writing', 'Reading', 'Speaking', 'Phonetics'];
  const questionTypes = ['Cloze', 'Dictionary Entry', 'Multiple choice', 'Reading comprehension', 'Sign', 'Transformation', 'Word form', 'FillInTheBlank'];
  const cognitiveLevels = ['Nhận biết', 'Thông hiểu', 'Vận dụng'];
  
  // Khối lớp (Sẽ hiển thị đầy đủ ở bộ lọc)
  const blockClasses = Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);

  return (
    <Card 
      className="shadow-sm border-0 mb-4" 
      style={{ 
        borderRadius: '12px',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.03)' 
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full"
      >
        <Row gutter={[16, 16]} align="bottom">
          {/* Hàng 1 – 6 ô lọc, mỗi ô md={4} */}
          <Col xs={24} sm={12} md={4}>
            <Form.Item name="block_class" label="Khối lớp" className="mb-0">
              <Select placeholder="Chọn Khối lớp" allowClear className="w-full">
                {blockClasses.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item name="unit" label="Unit" className="mb-0">
              <Select placeholder="Chọn Unit" allowClear className="w-full">
                {Array.from({ length: 12 }, (_, i) => {
                  const unitLabel = `Unit ${i + 1}`;
                  return (
                    <Option key={unitLabel} value={unitLabel}>
                      {unitLabel}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item name="skill" label="Kỹ năng" className="mb-0">
              <Select placeholder="Chọn Kỹ năng" allowClear className="w-full">
                {skills.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item name="question_type" label="Dạng câu hỏi" className="mb-0">
              <Select placeholder="Chọn Dạng câu hỏi" allowClear className="w-full">
                {questionTypes.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item name="cognitive_level" label="Mức độ nhận thức" className="mb-0">
              <Select placeholder="Chọn Mức độ" allowClear className="w-full">
                {cognitiveLevels.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Form.Item name="id" label="Mã câu hỏi (ID)" className="mb-0">
              <Input placeholder="Nhập ID" allowClear />
            </Form.Item>
          </Col>

          {/* Hàng 2 – Ô tìm kiếm + Nút bấm */}
          <Col xs={24} md={16}>
            <Form.Item name="keyword" label="Nội dung câu hỏi" className="mb-0">
              <Input placeholder="Tìm kiếm theo từ khóa nội dung câu hỏi..." allowClear />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button 
                  type="default" 
                  onClick={handleResetClick} 
                  icon={<ReloadOutlined />}
                  className="flex items-center justify-center h-10 px-4 rounded-lg"
                >
                  Làm mới
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
                  className="flex items-center justify-center h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 border-none"
                >
                  Tìm kiếm
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default QuestionFilter;
