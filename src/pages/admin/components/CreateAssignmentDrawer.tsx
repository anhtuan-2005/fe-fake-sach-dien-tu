import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, InputNumber, Select, Button, Table, Space, message, Row, Col, Typography, Card, Spin } from 'antd';
import { BookOutlined, UserOutlined, FolderOpenOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../../api';
import SelectLibraryQuestionsModal from './SelectLibraryQuestionsModal';

const { Title, Text } = Typography;
const { Option } = Select;

interface CreateAssignmentDrawerProps {
  open: boolean;
  onClose: () => void;
  classId: string | number;
  onSuccess: () => void;
  editingAssignmentId?: number | null;
}

interface Student {
  id: number;
  full_name: string;
  email: string;
  user_code: string;
}

interface ExerciseType {
  id: number;
  name: string;
  vietnamese_title: string;
}

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

const PREDEFINED_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#ec4899', '#a855f7', 
  '#6366f1', '#3b82f6', '#0ea5e9', '#14b8a6', '#10b981', 
  '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#f97316', 
  '#ea580c', '#78350f', '#64748b'
];

export const CreateAssignmentDrawer: React.FC<CreateAssignmentDrawerProps> = ({
  open,
  onClose,
  classId,
  onSuccess,
  editingAssignmentId = null
}) => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [selectedStudentKeys, setSelectedStudentKeys] = useState<React.Key[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6'); // default blue
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // Fetch dữ liệu khởi tạo
  useEffect(() => {
    if (open) {
      const initData = async () => {
        await fetchExerciseTypes();
        const loadedStudents = await fetchClassStudents();
        
        if (editingAssignmentId) {
          await fetchAssignmentDetails(editingAssignmentId);
        } else {
          // Reset form
          form.resetFields();
          setSelectedQuestions([]);
          setSelectedColor('#3b82f6');
        }
      };
      
      initData();
    }
  }, [open, editingAssignmentId]);

  const fetchClassStudents = async (): Promise<Student[]> => {
    try {
      // Gọi API lấy toàn bộ học sinh của lớp (không phân trang để giao bài cho cả lớp)
      const response = await api.get(`/admin/classes/${classId}/students`, {
        params: { page: 1, limit: 1000 }
      });
      if (response.data && response.data.success) {
        const studentList = response.data.data || [];
        setStudents(studentList);
        // Mặc định chọn tất cả học sinh nếu không phải edit mode
        if (!editingAssignmentId) {
          setSelectedStudentKeys(studentList.map((s: Student) => s.id));
        }
        return studentList;
      }
    } catch (error) {
      console.error('Error fetching classroom students:', error);
      message.error('Không thể tải danh sách học sinh của lớp');
    }
    return [];
  };

  const fetchAssignmentDetails = async (assignmentId: number) => {
    try {
      setLoadingDetails(true);
      const response = await api.get(`/admin/assignments/${assignmentId}`);
      if (response.data && response.data.success) {
        const assignment = response.data.data;
        form.setFieldsValue({
          title: assignment.title,
          exercise_type_id: assignment.exercise_type_id,
          max_score: assignment.max_score,
          requirements: assignment.requirements,
          duration: assignment.duration || '7d'
        });
        setSelectedColor(assignment.color || '#3b82f6');
        
        // Học sinh được giao bài
        if (assignment.students) {
          setSelectedStudentKeys(assignment.students.map((s: any) => s.student_id));
        }
        
        // Câu hỏi được chọn
        if (assignment.questions) {
          setSelectedQuestions(assignment.questions.map((q: any) => ({
            id: q.question_id,
            block_class: q.block_class,
            unit: q.unit,
            skill: q.skill,
            question_type: q.question_type,
            requirement: q.requirement,
            content: q.content,
            cognitive_level: q.cognitive_level
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching assignment details:', error);
      message.error('Không thể tải thông tin chi tiết bài tập');
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchExerciseTypes = async () => {
    try {
      const response = await api.get('/exercise-types');
      if (response.data && response.data.success) {
        setExerciseTypes(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching exercise types:', error);
      // Fallback nếu api lỗi
      setExerciseTypes([
        { id: 1, name: 'Trac nghiem', vietnamese_title: 'Trắc nghiệm' },
        { id: 2, name: 'Tu luan', vietnamese_title: 'Tự luận' }
      ]);
    }
  };

  const handleLibraryQuestionsSelect = (questions: Question[]) => {
    setSelectedQuestions(questions);
  };

  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleFinish = async (values: any) => {
    if (selectedStudentKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một học sinh để giao bài tập');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: values.title,
        exercise_type_id: values.exercise_type_id,
        max_score: values.max_score || 10,
        color: selectedColor,
        requirements: values.requirements || '',
        student_ids: selectedStudentKeys,
        question_ids: selectedQuestions.map(q => q.id),
        duration: values.duration || '7d'
      };

      let response;
      if (editingAssignmentId) {
        response = await api.put(`/admin/assignments/${editingAssignmentId}`, payload);
      } else {
        response = await api.post(`/admin/classes/${classId}/assignments`, payload);
      }

      if (response.data && response.data.success) {
        message.success(editingAssignmentId ? 'Cập nhật/Gia hạn bài tập thành công' : 'Tạo bài tập mới thành công');
        onSuccess();
        onClose();
      } else {
        message.error(response.data.message || (editingAssignmentId ? 'Cập nhật bài tập thất bại' : 'Tạo bài tập thất bại'));
      }
    } catch (error: any) {
      console.error('Error saving assignment:', error);
      message.error(error.response?.data?.message || 'Lỗi hệ thống khi lưu bài tập');
    } finally {
      setSubmitting(false);
    }
  };

  // Student table columns
  const studentColumns = [
    {
      title: 'Tên học sinh',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text: string) => (
        <Space>
          <UserOutlined className="text-gray-400" />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text type="secondary">{text}</Text>
    }
  ];

  // Question selection table in form
  const questionColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: number) => `#${id}`
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      width: 130
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 90,
      render: (_: any, record: Question) => (
        <Button type="link" danger onClick={() => handleRemoveQuestion(record.id)}>
          Xóa
        </Button>
      )
    }
  ];

  // Modules toolbar for Quill matching image
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link', 'image', 'video']                         // link and image, video
    ]
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center w-full pr-6">
          <span className="font-bold text-lg text-gray-700">
            {editingAssignmentId ? 'CẬP NHẬT / GIA HẠN BÀI TẬP' : 'TẠO MỚI BÀI TẬP'}
          </span>
        </div>
      }
      open={open}
      onClose={onClose}
      width="100%"
      destroyOnClose
      closeIcon={<CloseOutlined style={{ fontSize: '18px' }} />}
      footer={
        <div className="flex justify-end gap-2 px-4 py-2 border-t bg-gray-50">
          <Button onClick={onClose} size="large">Đóng</Button>
          <Button 
            type="primary" 
            onClick={() => form.submit()} 
            loading={submitting || loadingDetails} 
            size="large"
            icon={<SaveOutlined />}
            className="bg-blue-600 hover:bg-blue-700 border-none"
          >
            Lưu thông tin
          </Button>
        </div>
      }
    >
      <Spin spinning={loadingDetails} tip="Đang tải thông tin bài tập...">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ max_score: 10, duration: '7d' }}
        >
          <Row gutter={24}>
            {/* Cột trái: Nhập thông tin & chọn câu hỏi */}
            <Col xs={24} lg={15} className="space-y-6">
              <Form.Item
                name="title"
                label={<span className="font-semibold text-gray-700">Tiêu đề</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài tập' }]}
              >
                <Input placeholder="Nhập tiêu đề..." size="large" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item
                    name="exercise_type_id"
                    label={<span className="font-semibold text-gray-700">Loại bài tập:</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}
                  >
                    <Select placeholder="Chọn loại bài tập" size="large">
                      {exerciseTypes.map(t => (
                        <Option key={t.id} value={t.id}>{t.vietnamese_title || t.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="duration"
                    label={<span className="font-semibold text-gray-700">Thời gian làm bài:</span>}
                    rules={[{ required: true, message: 'Vui lòng chọn thời gian làm bài' }]}
                  >
                    <Select placeholder="Chọn thời gian" size="large">
                      <Option value="10p">10 phút</Option>
                      <Option value="15p">15 phút</Option>
                      <Option value="30p">30 phút</Option>
                      <Option value="60p">60 phút</Option>
                      <Option value="1d">1 ngày</Option>
                      <Option value="5d">5 ngày</Option>
                      <Option value="7d">7 ngày</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="max_score"
                    label={<span className="font-semibold text-gray-700">Điểm</span>}
                    rules={[{ required: true, message: 'Nhập điểm tối đa' }]}
                  >
                    <InputNumber min={1} max={10} size="large" className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

            {/* Bộ chọn màu sắc */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">Màu (Color)</label>
              <div className="flex flex-wrap gap-2 items-center">
                {PREDEFINED_COLORS.map(color => {
                  const isSelected = selectedColor === color;
                  const isWhite = color === '#ffffff';
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{
                        backgroundColor: color,
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: isSelected 
                          ? '3px solid #111827' 
                          : isWhite 
                            ? '1px solid #d1d5db' 
                            : 'none',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 0 0 2px #fff' : 'none',
                        transition: 'transform 0.1s ease'
                      }}
                      className="hover:scale-110"
                    />
                  );
                })}
              </div>
            </div>

            {/* Quill Editor */}
            <Form.Item
              name="requirements"
              label={<span className="font-semibold text-gray-700">Yêu cầu / Hướng dẫn (Requirements / Guide)</span>}
            >
              <ReactQuill 
                theme="snow" 
                modules={quillModules}
                placeholder="Nhập hướng dẫn làm bài tập tại đây..."
                className="bg-white rounded-lg shadow-inner min-h-[180px]"
              />
            </Form.Item>

            {/* Chọn bài tập từ thư viện */}
            <Card 
              title={
                <div className="flex justify-between items-center w-full">
                  <span className="font-semibold text-gray-700">Nội dung bài tập</span>
                  <Button 
                    type="default" 
                    icon={<FolderOpenOutlined />} 
                    onClick={() => setIsLibraryModalOpen(true)}
                  >
                    Chọn bài tập từ thư viện
                  </Button>
                </div>
              }
              className="border-gray-200 shadow-sm"
            >
              {selectedQuestions.length > 0 ? (
                <Table
                  dataSource={selectedQuestions}
                  columns={questionColumns}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  bordered
                />
              ) : (
                <div className="text-center py-6">
                  <Text className="text-gray-400 block mb-2">No data available</Text>
                  <Text type="danger" className="font-semibold">Chưa chọn bài tập từ thư viện</Text>
                </div>
              )}
            </Card>
          </Col>

          {/* Cột phải: Chọn học sinh giao bài */}
          <Col xs={24} lg={9}>
            <Card 
              title={
                <span className="font-semibold text-gray-700">
                  Chọn học sinh giao bài ({selectedStudentKeys.length}/{students.length})
                </span>
              }
              className="h-full border-gray-200 shadow-sm"
              styles={{ body: { padding: 0 } }}
            >
              <Table
                dataSource={students}
                columns={studentColumns}
                rowKey="id"
                pagination={false}
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: selectedStudentKeys,
                  onChange: (keys) => setSelectedStudentKeys(keys)
                }}
                scroll={{ y: 550 }}
                size="middle"
              />
            </Card>
          </Col>
        </Row>
      </Form>
      </Spin>

      {/* Modal chọn câu hỏi phụ */}
      <SelectLibraryQuestionsModal
        open={isLibraryModalOpen}
        onCancel={() => setIsLibraryModalOpen(false)}
        onSelect={handleLibraryQuestionsSelect}
        initialSelectedRowKeys={selectedQuestions.map(q => q.id)}
      />
    </Drawer>
  );
};

export default CreateAssignmentDrawer;
