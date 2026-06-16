import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Tag, Typography, Card, App } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import api from '../../../api';
import QuestionFilter from '../../admin/question-bank/components/QuestionFilter';
import QuestionModal from '../../admin/question-bank/components/QuestionModal';

const { Title } = Typography;

interface Question {
  id: number;
  block_class: string;
  unit: string;
  skill: string;
  question_type: string;
  requirement: string;
  content: string;
  audio_url?: string | null;
  image_url?: string | null;
  answers?: any;
  answer: string;
  cognitive_level: string;
  created_at: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export const TeacherQuestionBank: React.FC = () => {
  const { message: antdMessage } = App.useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Bộ lọc hiện tại
  const [filters, setFilters] = useState<any>({});
  
  // Phân trang
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail'>('create');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Fetch câu hỏi
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
          setPagination(response.data.pagination);
        }
      } else {
        antdMessage.error(response.data.message || 'Không thể lấy dữ liệu câu hỏi.');
      }
    } catch (error: any) {
      console.error('Lỗi khi fetch câu hỏi:', error);
      antdMessage.error(error.response?.data?.message || 'Lỗi kết nối server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1, filters);
  }, []);

  const handleSearch = (newFilters: any) => {
    setFilters(newFilters);
    fetchQuestions(1, newFilters);
  };

  const handleReset = () => {
    setFilters({});
    fetchQuestions(1, {});
  };

  const handlePageChange = (page: number) => {
    fetchQuestions(page, filters);
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedQuestion(null);
    setModalOpen(true);
  };

  const handleEdit = (record: Question) => {
    setModalMode('edit');
    setSelectedQuestion(record);
    setModalOpen(true);
  };

  const handleDetail = (record: Question) => {
    setModalMode('detail');
    setSelectedQuestion(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await api.delete(`/questions/${id}`);
      if (response.data && response.data.success) {
        antdMessage.success('Xóa câu hỏi thành công.');
        const isLastItemOnPage = questions.length === 1;
        const targetPage = isLastItemOnPage && pagination.currentPage > 1 
          ? pagination.currentPage - 1 
          : pagination.currentPage;
        fetchQuestions(targetPage, filters);
      } else {
        antdMessage.error(response.data.message || 'Xóa câu hỏi thất bại.');
      }
    } catch (error: any) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      antdMessage.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (formValues: any) => {
    try {
      if (modalMode === 'create') {
        const response = await api.post('/questions', formValues);
        if (response.data && response.data.success) {
          antdMessage.success('Thêm câu hỏi mới thành công.');
          setModalOpen(false);
          fetchQuestions(1, filters);
        }
      } else if (modalMode === 'edit' && selectedQuestion) {
        const response = await api.put(`/questions/${selectedQuestion.id}`, formValues);
        if (response.data && response.data.success) {
          antdMessage.success('Cập nhật câu hỏi thành công.');
          setModalOpen(false);
          fetchQuestions(pagination.currentPage, filters);
        }
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu câu hỏi:', error);
      throw error;
    }
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
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1 + (pagination.currentPage - 1) * pagination.itemsPerPage
    },
    {
      title: 'Nội dung câu hỏi',
      key: 'content',
      width: 320,
      ellipsis: true,
      render: (_: any, record: Question) => {
        const indicators = [];
        if (record.image_url) indicators.push('🖼️');
        if (record.audio_url) indicators.push('🔊');
        const textIndicator = indicators.length > 0 ? `${indicators.join(' ')} ` : '';
        return (
          <span title={record.content}>
            {textIndicator}{record.content}
          </span>
        );
      }
    },
    {
      title: 'Dạng câu hỏi',
      dataIndex: 'question_type',
      key: 'question_type',
      width: 140
    },
    {
      title: 'Mức độ',
      dataIndex: 'cognitive_level',
      key: 'cognitive_level',
      width: 120,
      render: (level: string) => getCognitiveLevelTag(level)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: 'Đáp án đúng',
      key: 'answers_list',
      width: 220,
      render: (_: any, record: Question) => {
        let answersList = record.answers;
        if (typeof answersList === 'string') {
          const trimmed = answersList.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
              answersList = JSON.parse(answersList);
            } catch (e) {
              return <Tag color="success">{answersList}</Tag>;
            }
          } else {
            return <Tag color="success">{answersList}</Tag>;
          }
        }
        if (Array.isArray(answersList)) {
          const correctAnswers = answersList.filter((ans: any) => ans.isCorrect);
          if (correctAnswers.length === 0) {
            return <span className="text-gray-400">Chưa chọn đáp án đúng</span>;
          }
          return (
            <div className="flex flex-wrap gap-1">
              {correctAnswers.map((ans: any, i: number) => (
                <Tag key={i} color="success">
                  {ans.type === 'image' ? '[Hình ảnh]' : ans.text}
                </Tag>
              ))}
            </div>
          );
        }
        return <span className="text-gray-400">-</span>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Question) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-500" />}
            onClick={() => handleDetail(record)}
            title="Xem chi tiết"
            className="hover:bg-blue-55"
          />
          <Button
            type="text"
            icon={<EditOutlined className="text-amber-500" />}
            onClick={() => handleEdit(record)}
            title="Sửa câu hỏi"
            className="hover:bg-amber-55"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa câu hỏi này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined className="text-red-500" />}
              title="Xóa câu hỏi"
              className="hover:bg-red-55"
            />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1250px] mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={2} className="m-0 text-blue-800 font-bold" style={{ color: '#1e3a8a' }}>
            Ngân hàng câu hỏi
          </Title>
          <p className="text-gray-500 m-0 mt-1">Quản lý kho lưu trữ câu hỏi và bài tập do Thầy/Cô biên soạn.</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg h-10 px-6 font-semibold flex items-center justify-center self-start md:self-auto shadow-md"
        >
          Tạo câu hỏi mới
        </Button>
      </div>

      <QuestionFilter onSearch={handleSearch} onReset={handleReset} />

      <Card 
        className="shadow-sm border-0 mt-6" 
        style={{ borderRadius: '12px', overflow: 'hidden' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          dataSource={questions}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.itemsPerPage,
            total: pagination.totalItems,
            onChange: handlePageChange,
            align: 'end',
            showSizeChanger: false,
            className: "px-6 py-4"
          }}
          className="teacher-question-bank-table"
        />
      </Card>

      <QuestionModal
        open={modalOpen}
        mode={modalMode}
        initialValues={selectedQuestion}
        onCancel={() => setModalOpen(false)}
        onSave={handleSaveQuestion}
      />

      <style>{`
        .teacher-question-bank-table .ant-table {
          background: #ffffff;
          border-radius: 12px;
        }
        .teacher-question-bank-table .ant-table-thead > tr > th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
          border-bottom: 1px solid #f1f5f9;
        }
        .teacher-question-bank-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
        }
        .teacher-question-bank-table .ant-table-tbody > tr:hover > td {
          background: #f8fafc !important;
        }
      `}</style>
    </div>
  );
};

export default TeacherQuestionBank;
