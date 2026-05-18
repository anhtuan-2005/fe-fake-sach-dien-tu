import React from 'react';
import { Form, Select, Input, Button, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { UserFilterState } from '../../../types';

interface UserFilterProps {
  onSearch: (filters: UserFilterState) => void;
  onReset: () => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log('>>> UserFilter: handleFinish triggered with values:', values);
    
    // Đảm bảo dữ liệu Tiếng Việt được xử lý an toàn (encodeURIComponent) theo yêu cầu
    // Lưu ý: Axios params sẽ tự encode, nhưng ở đây ta chuẩn hóa dữ liệu trước khi gửi
    const preparedValues = { ...values };
    
    // Nếu có các trường text tiếng Việt, ta có thể xử lý ở đây nếu cần thiết
    // Tuy nhiên, với Ant Design Select/Input, giá trị nhận được là string gốc.
    
    onSearch(preparedValues);
  };

  const handleResetClick = () => {
    console.log('>>> UserFilter: handleResetClick triggered');
    form.resetFields();
    onReset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <Form 
        form={form}
        layout="vertical" 
        onFinish={handleFinish}
        initialValues={{
          role: 'all',
          level: 'all',
          province: 'all',
          district: 'all'
        }}
      >
        {/* Hàng 1: 5 cột */}
        <Row gutter={[16, 16]} className="mb-4">
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="role" label="Loại tài khoản" className="mb-0">
              <Select options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'TEACHER', label: 'Giáo viên' },
                { value: 'STUDENT', label: 'Học sinh' }
              ]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Form.Item name="level" label="Cấp" className="mb-0">
              <Select options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'Cấp 1', label: 'Cấp 1' },
                { value: 'Cấp 2', label: 'Cấp 2' },
                { value: 'Cấp 3', label: 'Cấp 3' }
              ]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item name="province" label="Tỉnh / Thành phố" className="mb-0">
              <Select options={[{ value: 'all', label: 'Tất cả' }]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item name="district" label="Xã / Phường" className="mb-0">
              <Select options={[{ value: 'all', label: 'Tất cả' }]} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={16} lg={6}>
            <Form.Item name="school" label="Trường học" className="mb-0">
              <Input placeholder="Nhập tên trường" className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        {/* Hàng 2: 3 cột chính */}
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name="phone" label="Số điện thoại" className="mb-0">
              <Input placeholder="Nhập số điện thoại" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={10} lg={12}>
            <Form.Item name="email" label="Email" className="mb-0">
              <Input placeholder="Nhập email tìm kiếm" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <div className="flex space-x-2">
              <Button 
                type="primary" 
                htmlType="submit"
                icon={<SearchOutlined />} 
                className="flex-1 h-[32px] bg-blue-600 font-semibold"
              >
                Tìm kiếm
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleResetClick}
                className="flex-1 h-[32px] text-gray-600 border-gray-300"
              >
                Làm mới
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default UserFilter;
