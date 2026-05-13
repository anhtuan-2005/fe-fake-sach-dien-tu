import React from 'react';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const UserFilter: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} lg={3}>
            <Form.Item label="Loại tài khoản" className="mb-0">
              <Select defaultValue="all" options={[{ value: 'all', label: 'Tất cả' }]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={3}>
            <Form.Item label="Cấp" className="mb-0">
              <Select defaultValue="all" options={[{ value: 'all', label: 'Tất cả' }]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item label="Tỉnh / Thành phố" className="mb-0">
              <Select defaultValue="all" options={[{ value: 'all', label: 'Tất cả' }]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Form.Item label="Xã / Phường" className="mb-0">
              <Select defaultValue="all" options={[{ value: 'all', label: 'Tất cả' }]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item label="Trường học" className="mb-0">
              <Input placeholder="Nhập tên trường" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item label="Điện thoại" className="mb-0">
              <Input placeholder="Số điện thoại" className="w-full" />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={18} lg={20}>
            <Form.Item label="Email" className="mb-0">
              <Input placeholder="Nhập email tìm kiếm" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} lg={4} className="flex items-end">
            <Button 
              type="primary" 
              icon={<SearchOutlined />} 
              block 
              className="h-[32px] bg-blue-600 font-semibold"
            >
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UserFilter;
