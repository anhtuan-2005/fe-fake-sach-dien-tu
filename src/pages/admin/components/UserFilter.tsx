import React from 'react';
import { Form, Select, Input, Button, Row, Col, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { UserFilterState } from '../../../types';

interface UserFilterProps {
  filters: UserFilterState;
  onSearch: (values: UserFilterState) => void;
  onReset: () => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ filters, onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card className="mb-4 shadow-sm border-gray-100 rounded-xl overflow-hidden">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={filters}
        className="bg-white"
      >
        <Row gutter={[12, 12]}>
          {/* Loại tài khoản */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Item name="role" label={<span className="font-medium text-gray-600">Loại tài khoản</span>} className="mb-2">
              <Select
                placeholder="Tất cả"
                size="large"
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'ADMIN', label: 'Admin' },
                  { value: 'TEACHER', label: 'Giáo viên' },
                  { value: 'STUDENT', label: 'Học sinh' },
                ]}
                className="w-full rounded-lg"
              />
            </Form.Item>
          </Col>

          {/* Cấp */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Item name="level" label={<span className="font-medium text-gray-600">Cấp học</span>} className="mb-2">
              <Select
                placeholder="Tất cả"
                size="large"
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'Cấp 1', label: 'Cấp 1' },
                  { value: 'Cấp 2', label: 'Cấp 2' },
                  { value: 'Cấp 3', label: 'Cấp 3' },
                ]}
                className="w-full rounded-lg"
              />
            </Form.Item>
          </Col>

          {/* Tỉnh/Thành phố */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Item name="province" label={<span className="font-medium text-gray-600">Tỉnh/Thành</span>} className="mb-2">
              <Select
                placeholder="Tất cả"
                size="large"
                options={[{ value: 'all', label: 'Tất cả' }]}
                className="w-full rounded-lg"
              />
            </Form.Item>
          </Col>

          {/* Xã/Phường */}
          <Col xs={12} sm={12} md={6} lg={4}>
            <Form.Item name="district" label={<span className="font-medium text-gray-600">Xã/Phường</span>} className="mb-2">
              <Select
                placeholder="Tất cả"
                size="large"
                options={[{ value: 'all', label: 'Tất cả' }]}
                className="w-full rounded-lg"
              />
            </Form.Item>
          </Col>

          {/* Trường học */}
          <Col xs={24} sm={24} md={12} lg={8}>
            <Form.Item name="school" label={<span className="font-medium text-gray-600">Trường học</span>} className="mb-2">
              <Input placeholder="Nhập tên trường học" className="h-10 rounded-lg" allowClear />
            </Form.Item>
          </Col>

          {/* Số điện thoại */}
          <Col xs={24} sm={12} md={6} lg={5}>
            <Form.Item name="phone" label={<span className="font-medium text-gray-600">Số điện thoại</span>} className="mb-2">
              <Input placeholder="Nhập số điện thoại" className="h-10 rounded-lg" allowClear />
            </Form.Item>
          </Col>

          {/* Email */}
          <Col xs={24} sm={12} md={10} lg={13}>
            <Form.Item name="email" label={<span className="font-medium text-gray-600">Email</span>} className="mb-2">
              <Input placeholder="Nhập email cần tìm" className="h-10 rounded-lg" allowClear />
            </Form.Item>
          </Col>

          {/* Nút bấm */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <Form.Item label={<span className="invisible block">Action</span>} className="mb-2">
              <div className="flex w-full gap-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                  className="flex-1 bg-blue-600 h-10 font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  Tìm kiếm
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  className="flex-1 h-10 font-medium rounded-lg border-gray-300 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                >
                  Làm mới
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default UserFilter;
