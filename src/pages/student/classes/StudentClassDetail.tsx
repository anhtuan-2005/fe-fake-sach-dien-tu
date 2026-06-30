import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Breadcrumb,
  Typography,
  Tag,
  Table,
  Progress,
  List,
  Avatar,
  Badge,
  Modal,
  Radio,
  Space,
  Timeline,
  Spin,
  App,
  Input
} from 'antd';
import {
  ArrowLeftOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  NotificationOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  RightOutlined
} from '@ant-design/icons';
import api from '../../../api';
import { Classroom, User, ApiResponse } from '../../../types';

const { Title, Text, Paragraph } = Typography;

// Interfaces cho bài tập mẫu
interface Assignment {
  id: string | number;
  title: string;
  dueDate: string;
  status: 'done' | 'pending' | 'late';
  score?: number;
  maxScore: number;
  questions?: {
    id: number;
    text: string;
    questionType?: string;
    options: string[];
    correctIndex: number;
  }[];
}

export const StudentClassDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [loading, setLoading] = useState<boolean>(true);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [classmates, setClassmates] = useState<User[]>([]);

  // States cho Modal làm bài tập
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
  const [testResult, setTestResult] = useState<{ 
    score: number; 
    correctCount: number; 
    showResult: boolean;
    evaluation?: { [key: number]: { isCorrect: boolean; correctAnswer: string } };
  } | null>(null);

  // Dữ liệu bài tập về nhà của lớp (lấy động từ API)
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState<boolean>(false);

  const fetchAssignments = useCallback(async () => {
    setAssignmentsLoading(true);
    try {
      const response = await api.get<ApiResponse<Assignment[]>>(`/admin/student/classes/${id}/assignments`);
      if (response.data && response.data.success) {
        setAssignments(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Lỗi khi tải bài tập:', error);
      message.error(error.response?.data?.message || 'Không thể tải danh sách bài tập.');
    } finally {
      setAssignmentsLoading(false);
    }
  }, [id, message]);

  // Gọi API lấy chi tiết lớp học
  const fetchClassDetails = useCallback(async () => {
    setLoading(true);
    try {
      // Endpoint: GET /api/admin/classes/:id
      const classResponse = await api.get<ApiResponse<Classroom>>(`/admin/classes/${id}`);
      if (classResponse.data && classResponse.data.success) {
        setClassroom(classResponse.data.data || null);
      }

      // Endpoint: GET /api/admin/classes/:id/students
      const classmatesResponse = await api.get<ApiResponse<User[]>>(`/admin/classes/${id}/students?limit=100`);
      if (classmatesResponse.data && classmatesResponse.data.success) {
        setClassmates(classmatesResponse.data.data || []);
      }
    } catch (error: any) {
      console.error('Lỗi khi fetch chi tiết lớp:', error);
      message.error(error.response?.data?.message || 'Không thể tải thông tin chi tiết lớp học.');
    } finally {
      setLoading(false);
    }
  }, [id, message]);

  useEffect(() => {
    fetchClassDetails();
    fetchAssignments();
  }, [fetchClassDetails, fetchAssignments]);

  // Mock dữ liệu sách giáo khoa cho lớp
  const mockBooks = [
    {
      id: 1,
      title: 'Tiếng Anh Lớp 5 - Tập 2 (Sách Học Sinh)',
      author: 'NXB Giáo Dục Việt Nam',
      description: 'Sách giáo khoa Tiếng Anh Lớp 5 Tập 2 học kỳ II, cung cấp 10 đơn vị bài học tiếp theo.',
      coverColor: 'from-sky-400 to-blue-600',
      grade: 'Lớp 5'
    },
    {
      id: 2,
      title: 'Bài tập Bổ trợ Tiếng Anh 5 (Tập 2)',
      author: 'Phương Nam Book',
      description: 'Sách bài tập ôn luyện ngữ pháp, nâng cao kỹ năng nghe, đọc viết cho học sinh lớp 5.',
      coverColor: 'from-teal-400 to-emerald-600',
      grade: 'Lớp 5'
    },
    {
      id: 3,
      title: 'Truyện đọc song ngữ Anh - Việt: Robin Hood',
      author: 'NXB Phương Nam',
      description: 'Tài liệu đọc tham khảo tăng cường vốn từ vựng và nâng cao thói quen đọc sách tiếng Anh.',
      coverColor: 'from-amber-400 to-orange-600',
      grade: 'Đọc thêm'
    }
  ];

  // Mock Bảng tin thông báo
  const mockAnnouncements = [
    {
      id: 1,
      title: 'Yêu cầu hoàn thành bài tập Unit 7',
      content: 'Chào cả lớp, thầy nhắc các bạn hoàn thành bài tập trắc nghiệm Unit 7 trước ngày 10/06 để chuẩn bị cho buổi ôn tập học kỳ II nhé.',
      date: '02/06/2026 09:00',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Lịch thi nói học kỳ II',
      content: 'Lớp chúng ta sẽ tiến hành kiểm tra nói (Speaking Test) trực tiếp tại phòng học đa năng vào thứ Hai tuần tới (08/06). Các em ôn tập kỹ phần giới thiệu sở thích và ước mơ nghề nghiệp.',
      date: '30/05/2026 14:30',
      type: 'info'
    },
    {
      id: 3,
      title: 'Khen thưởng học sinh xuất sắc tháng 5',
      content: 'Chúc mừng bạn Nguyễn Hoàng Nam và bạn Lê Mai Anh đã đạt điểm 10 tuyệt đối trong các bài kiểm tra rèn luyện tháng vừa qua! Cả lớp cùng noi gương học tập tốt nhé.',
      date: '25/05/2026 16:00',
      type: 'success'
    }
  ];

  // Mở modal làm bài tập
  const startAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setUserAnswers({});
    setTestResult(null);
    setIsTestModalOpen(true);
  };

  // Nộp bài tập
  const handleSubmitTest = async () => {
    if (!selectedAssignment || !selectedAssignment.questions) return;

    try {
      const response = await api.post(`/admin/student/assignments/${selectedAssignment.id}/submit`, {
        answers: userAnswers
      });

      if (response.data && response.data.success) {
        const result = response.data.data;
        setTestResult({
          score: result.score,
          correctCount: result.correctCount,
          showResult: true,
          evaluation: result.evaluation
        });

        message.success(`Nộp bài thành công! Bạn đạt ${result.score} / ${selectedAssignment.maxScore || 10} điểm.`);
        fetchAssignments();
      }
    } catch (error: any) {
      console.error('Lỗi khi nộp bài:', error);
      message.error(error.response?.data?.message || 'Nộp bài thất bại. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang tải dữ liệu lớp học..." />
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl shadow-sm max-w-md mx-auto mt-12">
        <CloseCircleOutlined className="text-red-500 text-5xl mb-4" />
        <Title level={4}>Không tìm thấy lớp học</Title>
        <Paragraph className="text-gray-500 mb-6">
          Lớp học không tồn tại hoặc bạn không có quyền truy cập lớp học này.
        </Paragraph>
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/student/classes')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const activeAssignments = assignments.filter(a => a.status === 'pending');
  const completedAssignments = assignments.filter(a => a.status === 'done' || a.status === 'late');
  const completionPercent = assignments.length > 0
    ? Math.round((assignments.filter(a => a.status === 'done').length / assignments.length) * 100)
    : 0;

  const tabItems = [
    {
      key: 'lessons',
      label: (
        <span>
          <BookOutlined /> Bài học & Tài liệu
        </span>
      ),
      children: (
        <div className="pt-2">
          <Row gutter={[20, 20]}>
            {mockBooks.map((book) => (
              <Col xs={24} sm={12} md={8} key={book.id}>
                <Card
                  hoverable
                  className="h-full border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between rounded-xl"
                  styles={{ body: { padding: 0 } }}
                >
                  <div className={`p-6 bg-gradient-to-br ${book.coverColor} text-white relative h-36 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <BookOutlined className="text-2xl opacity-80" />
                      <Tag color="rgba(255,255,255,0.25)" className="text-white border-0 rounded-full font-medium m-0">
                        {book.grade}
                      </Tag>
                    </div>
                    <Text className="text-white font-bold text-base line-clamp-2 mt-2 leading-snug">{book.title}</Text>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <Paragraph className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {book.description}
                    </Paragraph>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                      <span className="text-xs text-gray-400 font-medium">Tác giả: {book.author}</span>
                      <Button
                        type="link"
                        icon={<RightOutlined />}
                        className="text-emerald-600 hover:text-emerald-700 font-bold p-0"
                        onClick={() => navigate('/student/books')}
                      >
                        Đọc sách
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )
    },
    {
      key: 'exercises',
      label: (
        <span>
          <FileTextOutlined /> Bài tập về nhà
        </span>
      ),
      children: (
        <div className="pt-2">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card
                title={<span className="font-bold text-gray-700">Bài tập chưa làm ({activeAssignments.length})</span>}
                className="border-0 shadow-sm rounded-xl"
              >
                {activeAssignments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircleOutlined className="text-emerald-500 text-3xl mb-2" />
                    <p className="m-0 font-medium">Tuyệt vời! Bạn đã hoàn thành tất cả bài tập.</p>
                  </div>
                ) : (
                  <List
                    dataSource={activeAssignments}
                    renderItem={(item) => (
                      <List.Item
                        className="p-4 border-b border-gray-50 flex justify-between items-center hover:bg-slate-50 rounded-lg transition-colors mb-2"
                        actions={[
                          <Button
                            type="primary"
                            size="middle"
                            onClick={() => startAssignment(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 border-none font-semibold rounded-lg"
                          >
                            Làm bài
                          </Button>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<FileTextOutlined />} className="bg-emerald-50 text-emerald-600" />}
                          title={<span className="font-semibold text-gray-700">{item.title}</span>}
                          description={
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                              <ClockCircleOutlined /> Hạn nộp: {item.dueDate ? new Date(item.dueDate).toLocaleString('vi-VN') : 'Không giới hạn'}
                            </span>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={<span className="font-bold text-gray-700">Bài tập đã nộp / Quá hạn</span>}
                className="border-0 shadow-sm rounded-xl"
              >
                <List
                  dataSource={completedAssignments}
                  renderItem={(item) => (
                    <List.Item className="p-4 border-b border-gray-50 flex justify-between items-center mb-2">
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={item.status === 'done' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                            className={item.status === 'done' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}
                          />
                        }
                        title={<span className="font-semibold text-gray-700">{item.title}</span>}
                        description={
                          <span className="text-xs text-gray-400">
                            Hạn nộp: {item.dueDate ? new Date(item.dueDate).toLocaleString('vi-VN') : 'Không giới hạn'}
                          </span>
                        }
                      />
                      <div className="text-right">
                        {item.status === 'done' ? (
                          <div className="flex flex-col items-end">
                            <Tag color="blue" className="rounded-full font-medium m-0 mb-1">Đã nộp</Tag>
                            <span className="font-bold text-blue-600">{item.score} / {item.maxScore} điểm</span>
                          </div>
                        ) : (
                          <Tag color="error" className="rounded-full font-medium m-0">Trễ hạn</Tag>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'classmates',
      label: (
        <span>
          <TeamOutlined /> Bạn học ({classmates.length})
        </span>
      ),
      children: (
        <div className="pt-2">
          {/* Giáo viên phụ trách */}
          <Card className="mb-6 border-0 shadow-sm rounded-xl bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Avatar
                  size={60}
                  icon={<UserOutlined />}
                  className="bg-amber-100 text-amber-600 border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800 text-base">{classroom.teacher_name || 'Chưa phân công'}</span>
                    <Tag color="warning" className="rounded-full font-semibold">Giáo viên phụ trách</Tag>
                  </div>
                  <Text className="text-gray-400 text-sm block mt-0.5">Email: {classroom.teacher_email || '-'}</Text>
                  <Text className="text-gray-400 text-sm block">SĐT: {classroom.teacher_phone || '-'}</Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Danh sách học sinh */}
          <Row gutter={[16, 16]}>
            {classmates.map((student) => (
              <Col xs={24} sm={12} md={8} key={student.id}>
                <Card className="border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={45}
                      icon={<UserOutlined />}
                      src={student.avatar_url || undefined}
                      className="bg-blue-50 text-blue-600"
                    />
                    <div className="overflow-hidden">
                      <span className="font-bold text-gray-700 block truncate">{student.full_name}</span>
                      <Text className="text-gray-400 text-xs block mt-0.5">Mã: {student.user_code}</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )
    },
    {
      key: 'announcements',
      label: (
        <span>
          <NotificationOutlined /> Thông báo
        </span>
      ),
      children: (
        <div className="pt-4 max-w-[800px] mx-auto">
          <Timeline mode="left">
            {mockAnnouncements.map((item) => (
              <Timeline.Item
                key={item.id}
                dot={
                  <Badge
                    status={
                      item.type === 'warning' ? 'warning' :
                        item.type === 'success' ? 'success' : 'processing'
                    }
                  />
                }
              >
                <Card className="border border-gray-100 shadow-sm rounded-xl mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-700 text-base">{item.title}</span>
                    <Text className="text-gray-400 text-xs font-semibold">{item.date}</Text>
                  </div>
                  <Paragraph className="text-gray-500 m-0 leading-relaxed">
                    {item.content}
                  </Paragraph>
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1250px] mx-auto p-4 md:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            href: '/',
            title: <HomeOutlined />,
          },
          {
            href: '/student/classes',
            title: 'Lớp học của tôi',
          },
          {
            title: classroom.class_name,
          },
        ]}
        className="mb-6"
      />

      {/* Class Banner Header Card */}
      <Card
        className="mb-6 border-0 shadow-sm rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white"
        styles={{ body: { padding: '24px 32px' } }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/student/classes')}
              className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg mb-4"
            >
              Quay lại danh sách
            </Button>
            <Title level={2} className="text-white font-bold m-0 leading-tight">
              {classroom.class_name}
            </Title>
            <Space className="mt-3 flex-wrap">
              <Tag color="rgba(255,255,255,0.2)" className="text-white border-0 font-semibold px-3 py-0.5 rounded-full">
                Mã lớp: {classroom.class_code}
              </Tag>
              <Tag color="rgba(255,255,255,0.2)" className="text-white border-0 font-semibold px-3 py-0.5 rounded-full">
                Sĩ số: {classroom.student_count || classmates.length} học sinh
              </Tag>
            </Space>
          </div>

          {/* Progress Card right aligned */}
          <div className="bg-white/10 p-5 rounded-2xl border border-white/10 min-w-[200px] text-center backdrop-blur-sm">
            <span className="text-xs text-indigo-100 font-semibold block mb-1">TIẾN ĐỘ LÀM BÀI</span>
            <Progress
              type="circle"
              percent={completionPercent}
              size={70}
              strokeColor="#10b981"
              trailColor="rgba(255,255,255,0.15)"
              format={percent => <span className="text-white font-bold text-sm">{percent}%</span>}
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card className="border-0 shadow-sm rounded-2xl">
        <Tabs
          defaultActiveKey="lessons"
          items={tabItems}
          className="class-detail-tabs"
        />
      </Card>

      {/* Modal làm bài tập trắc nghiệm */}
      <Modal
        title={
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileTextOutlined className="text-emerald-500 text-lg" />
            <span className="font-bold text-gray-700 text-lg">{selectedAssignment?.title}</span>
          </div>
        }
        open={isTestModalOpen}
        onCancel={() => setIsTestModalOpen(false)}
        footer={null}
        width={700}
        destroyOnHidden
        mask={{ closable: false }}
        className="rounded-xl overflow-hidden"
      >
        {selectedAssignment?.questions && !testResult?.showResult && (
          <div className="py-4">
            {selectedAssignment.questions.map((q, idx) => (
              <div key={q.id} className="mb-6 p-4 border border-gray-100 rounded-xl bg-slate-50/50">
                <Paragraph className="font-bold text-gray-700 mb-3 text-sm">
                  Câu {idx + 1}: {q.text}
                </Paragraph>
                {q.questionType === 'Multiple choice' || (q.options && q.options.length > 0) ? (
                  <Radio.Group
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    value={userAnswers[q.id]}
                    className="w-full"
                  >
                    <Space direction="vertical" className="w-full">
                      {q.options.map((opt, oIdx) => (
                        <Radio
                          key={oIdx}
                          value={oIdx}
                          className="p-2 border border-gray-100 rounded-lg w-full bg-white hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-gray-600 text-xs font-semibold mr-2">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <span className="text-gray-700 text-sm font-medium">{opt}</span>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                ) : (
                  <Input
                    placeholder="Nhập câu trả lời của bạn tại đây..."
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    value={userAnswers[q.id] || ''}
                    size="large"
                    className="rounded-lg"
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <Button onClick={() => setIsTestModalOpen(false)} className="rounded-lg h-10 px-5">
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleSubmitTest}
                disabled={Object.keys(userAnswers).length < selectedAssignment.questions.length}
                className="bg-emerald-600 hover:bg-emerald-700 border-none font-semibold rounded-lg h-10 px-6"
              >
                Nộp bài
              </Button>
            </div>
          </div>
        )}

        {/* Màn hình kết quả sau khi nộp */}
        {testResult?.showResult && selectedAssignment?.questions && (
          <div className="text-center py-8">
            <TrophyOutlined className="text-yellow-500 text-6xl mb-4 animate-bounce" />
            <Title level={2} className="m-0 text-gray-800">Hoàn thành bài tập!</Title>
            <Paragraph className="text-gray-400 mt-2 text-sm">
              Kết quả bài trắc nghiệm của bạn được ghi nhận vào hệ thống học tập của lớp.
            </Paragraph>

            <div className="my-6 max-w-xs mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-gray-400 font-semibold block mb-1">ĐIỂM SỐ</span>
              <span className="text-4xl font-extrabold text-blue-600">{testResult.score}</span>
              <span className="text-gray-400 text-base font-bold"> / 10</span>
              <span className="text-xs text-emerald-500 font-semibold block mt-2">
                Trả lời đúng {testResult.correctCount} / {selectedAssignment.questions.length} câu
              </span>
            </div>

            {/* Chi tiết đáp án */}
            <div className="text-left mb-6 max-h-60 overflow-y-auto px-4">
              <span className="font-bold text-gray-700 text-sm mb-3 block">Chi tiết đáp án:</span>
              {selectedAssignment.questions.map((q, idx) => {
                const questionEval = testResult?.evaluation?.[q.id];
                const isMultipleChoice = q.questionType === 'Multiple choice' || (q.options && q.options.length > 0);
                
                const isCorrect = questionEval 
                  ? questionEval.isCorrect 
                  : (isMultipleChoice ? userAnswers[q.id] === q.correctIndex : false);
                  
                const correctLabel = questionEval 
                  ? questionEval.correctAnswer 
                  : (isMultipleChoice ? q.options[q.correctIndex] : '');

                const studentLabel = isMultipleChoice 
                  ? (q.options[userAnswers[q.id]] || 'Chưa chọn') 
                  : (userAnswers[q.id] || 'Chưa điền');

                return (
                  <div key={q.id} className="mb-4 border-b border-gray-50 pb-3 flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircleOutlined className="text-emerald-500 mt-1" />
                    ) : (
                      <CloseCircleOutlined className="text-red-500 mt-1" />
                    )}
                    <div>
                      <span className="font-semibold text-gray-700 text-xs">Câu {idx + 1}: {q.text}</span>
                      <div className="text-xs mt-1">
                        <span className="text-gray-400">Bạn đã chọn: </span>
                        <span className={isCorrect ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                          {studentLabel}
                        </span>
                        {!isCorrect && (
                          <span className="text-emerald-600 block mt-0.5">
                            Đáp án đúng: <strong>{correctLabel}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              type="primary"
              onClick={() => setIsTestModalOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 border-none font-semibold rounded-lg h-10 px-8"
            >
              Đóng lại
            </Button>
          </div>
        )}
      </Modal>

      <style>{`
        .class-detail-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #f1f5f9;
        }
        .class-detail-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #4f46e5 !important;
        }
        .class-detail-tabs .ant-tabs-ink-bar {
          background: #4f46e5 !important;
        }
      `}</style>
    </div>
  );
};

export default StudentClassDetail;
// Trigger IDE file watcher refresh

