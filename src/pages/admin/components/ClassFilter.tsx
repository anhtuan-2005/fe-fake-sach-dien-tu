import React from 'react';
import { Select, Input, Button, Space, Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ClassFilterState } from '../../../types';

interface ClassFilterProps {
  filters: ClassFilterState;
  onSearch: (filters: ClassFilterState) => void;
  onReset: () => void;
}

const ClassFilter: React.FC<ClassFilterProps> = ({ filters, onSearch, onReset }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSearch(values);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <Form
        form={form}
        layout="inline"
        initialValues={filters}
        onFinish={handleFinish}
        className="flex flex-wrap gap-y-4"
      >
        <Form.Item name="status">
          <Select style={{ width: 140 }} placeholder="Trạng thái">
            <Select.Option value="Tất cả">Tất cả</Select.Option>
            <Select.Option value="Đang dùng">Đang dùng</Select.Option>
            <Select.Option value="Ngừng sử dụng">Ngừng sử dụng</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="searchType">
          <Select style={{ width: 120 }}>
            <Select.Option value="Tên lớp">Tên lớp</Select.Option>
            <Select.Option value="Mã lớp">Mã lớp</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="keyword">
          <Input 
            placeholder="Nhập từ khóa..." 
            style={{ width: 250 }}
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SearchOutlined />}
              className="bg-blue-600"
            >
              Tìm kiếm
            </Button>
            <Button onClick={() => {
              form.resetFields();
              onReset();
            }}>
              Làm mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ClassFilter;
