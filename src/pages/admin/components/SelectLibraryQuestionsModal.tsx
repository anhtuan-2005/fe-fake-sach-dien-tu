import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, Form, Row, Col, Select, Input, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, DatabaseOutlined } from '@ant-design/icons';
import api from '../../../api';

const { Option } = Select;

interface Question {
  id: number;
  block_class: string;
  unit: string;
  skill: string;
  question_type: string;
  requirement: string;
  content: string;
  cognitive_level: string;
}

interface SelectLibraryQuestionsModalProps {
  open: boolean;
  onCancel: () => void;
  onSelect: (selectedQuestions: Question[]) => void;
  initialSelectedRowKeys: React.Key[];
}

export const SelectLibraryQuestionsModal: React.FC<SelectLibraryQuestionsModalProps> = ({
  open,
  onCancel,
  onSelect,
  initialSelectedRowKeys
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<Question[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
    pageSize: 10
  });

  const fetchQuestions = async (page: number = 1, currentFilters: any = filters) => {
    try {
      setLoading(true);
      const params = {
        page,
        pageSize: 10,
        ...currentFilters
      };
      const response = await api.get('/questions', { params });
      if (response.data && response.data.success) {
        setQuestions(response.data.data);
        if (response.data.pagination) {
          setPagination({
            currentPage: response.data.pagination.currentPage,
            totalItems: response.data.pagination.totalItems,
            pageSize: response.data.pagination.itemsPerPage
          });
        }
      }
    } catch (error) {
      console.error('Error fetching library questions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedRowKeys(initialSelectedRowKeys);
      // Fetch selected rows from initial state or fetch all questions
      fetchQuestions(1, {});
    }
  }, [open]);

  const handleFinish = (values: any) => {
    const cleanedValues: any = {};
    Object.keys(values).forEach((key) => {
      if (values[key] !== undefined && values[key] !== '') {
        cleanedValues[key] = values[key];
      }
    });
    setFilters(cleanedValues);
    fetchQuestions(1, cleanedValues);
  };

  const handleResetClick = () => {
    form.resetFields();
    setFilters({});
    fetchQuestions(1, {});
  };

  const handlePageChange = (page: number) => {
    fetchQuestions(page, filters);
  };

  const handleSave = () => {
    // Để giữ lại các rows đã chọn trên các trang khác nhau, chúng ta merge
    // hoặc chỉ lấy các rows hiện tại + lọc theo selectedRowKeys.
    // Thực tế cách an toàn nhất là lấy selectedRows đã được cập nhật qua onChange
    onSelect(selectedRows);
    onCancel();
  };

  const getCognitiveLevelTag = (level: string) => {
    switch (level) {
      case 'Nhận biết':
        return <Tag color="green">{level}</Tag>;
      case 'Thông hiểu':
        return <Tag color="blue">{level}</Tag>;
      case 'Vận dụng':
        return <Tag color="orange">{level}</Tag>;
      default:
        return <Tag>{level}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã CH',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: number) => <span className="font-bold text-gray-500">#{id}</span>
    },
    {
      title: 'Khối lớp',
      dataIndex: 'block_class',
      key: 'block_class',
      width: 100
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 120,
      ellipsis: true
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      width: 140,
      render: (skill: string) => <Tag color="purple">{skill}</Tag>
    },
    {
      title: 'Dạng câu hỏi',
      dataIndex: 'question_type',
      key: 'question_type',
      width: 120
    },
    {
      title: 'Mức độ',
      dataIndex: 'cognitive_level',
      key: 'cognitive_level',
      width: 110,
      render: (level: string) => getCognitiveLevelTag(level)
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    }
  ];

  const skills = ['Vocabulary & Structures', 'Writing', 'Reading', 'Speaking', 'Phonetics'];
  const questionTypes = ['Cloze', 'Dictionary Entry', 'Multiple choice', 'Reading comprehension', 'Sign', 'Transformation', 'Word form', 'FillInTheBlank'];
  const cognitiveLevels = ['Nhận biết', 'Thông hiểu', 'Vận dụng'];
  const blockClasses = Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);

  return (
    <Modal
      title={
        <span className="flex items-center gap-2 text-blue-800 font-bold text-lg">
          <DatabaseOutlined /> Chọn bài tập từ thư viện
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSave}
      width={1000}
      okText="Xác nhận"
      cancelText="Hủy"
      styles={{ body: { padding: '12px 24px' } }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} className="mb-4">
        <Row gutter={[12, 12]} align="bottom">
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="block_class" label="Khối lớp" className="mb-0">
              <Select placeholder="Tất cả" allowClear size="small">
                {blockClasses.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="skill" label="Kỹ năng" className="mb-0">
              <Select placeholder="Tất cả" allowClear size="small">
                {skills.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="cognitive_level" label="Mức độ" className="mb-0">
              <Select placeholder="Tất cả" allowClear size="small">
                {cognitiveLevels.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item name="keyword" label="Nội dung" className="mb-0">
              <Input placeholder="Từ khóa..." allowClear size="small" />
            </Form.Item>
          </Col>
          <Col xs={24} className="flex justify-end mt-2">
            <Space>
              <Button size="small" onClick={handleResetClick} icon={<ReloadOutlined />}>
                Làm mới
              </Button>
              <Button type="primary" size="small" htmlType="submit" icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        dataSource={questions}
        columns={columns}
        rowKey="id"
        loading={loading}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (keys, rows) => {
            setSelectedRowKeys(keys);
            // Để tránh mất các rows được select từ trang trước:
            // merge hàng mới vào hàng đã chọn trước đó
            const newRowsMap = new Map();
            selectedRows.forEach(r => newRowsMap.set(r.id, r));
            rows.forEach(r => newRowsMap.set(r.id, r));
            // Lọc ra các hàng không nằm trong keys nữa
            const updatedRows: Question[] = [];
            keys.forEach(k => {
              if (newRowsMap.has(k)) {
                updatedRows.push(newRowsMap.get(k));
              }
            });
            setSelectedRows(updatedRows);
          }
        }}
        pagination={{
          current: pagination.currentPage,
          pageSize: pagination.pageSize,
          total: pagination.totalItems,
          onChange: handlePageChange,
          size: 'small',
          showSizeChanger: false
        }}
        bordered
        size="small"
        scroll={{ y: 350 }}
      />
    </Modal>
  );
};

export default SelectLibraryQuestionsModal;
