import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Row, Col, Button, Checkbox, Space, Divider, App, Upload, Radio } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import useAuthStore from '../../../../store/useAuthStore';
import api from '../../../../api';

const { Option } = Select;
const { TextArea } = Input;

interface QuestionAnswer {
  text: string;
  isCorrect: boolean;
}

interface QuestionModalProps {
  open: boolean;
  mode: 'create' | 'edit' | 'detail';
  initialValues?: any;
  onCancel: () => void;
  onSave: (values: any) => Promise<void>;
}

export const getQuestionTypesBySkill = (skillName: string): string[] => {
  switch (skillName) {
    case 'Vocabulary & Structures':
      return ['Multiple choice', 'Word form'];
    case 'Writing':
      return ['Dictionary Entry', 'Transformation'];
    case 'Reading':
      return ['Cloze', 'Reading comprehension', 'Sign'];
    case 'Speaking':
      return ['Multiple choice'];
    case 'Phonetics':
      return ['Multiple choice'];
    default:
      return [];
  }
};

export const QuestionModal: React.FC<QuestionModalProps> = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSave
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [blockClasses, setBlockClasses] = useState<string[]>([]);
  const [parsedAnswers, setParsedAnswers] = useState<any[]>([]);

  // Theo dõi giá trị Kỹ năng để lọc Dạng câu hỏi tương ứng
  const selectedSkill = Form.useWatch('skill', form);

  // Theo dõi giá trị Dạng câu hỏi
  const selectedQuestionType = Form.useWatch('question_type', form);

  // Tự động reset Dạng câu hỏi nếu thay đổi Kỹ năng sang nhóm khác
  useEffect(() => {
    if (selectedSkill) {
      const allowedTypes = getQuestionTypesBySkill(selectedSkill);
      const currentType = form.getFieldValue('question_type');
      if (currentType && !allowedTypes.includes(currentType)) {
        form.setFieldValue('question_type', undefined);
      }
    }
  }, [selectedSkill, form]);

  // Tự động điều chỉnh số lượng đáp án khi chuyển sang dạng Word form hoặc ngược lại
  useEffect(() => {
    if (open) {
      if (selectedQuestionType === 'Word form') {
        const currentAnswers = form.getFieldValue('answers');
        if (!currentAnswers || currentAnswers.length === 0) {
          form.setFieldValue('answers', [{ text: '', isCorrect: true }]);
        } else if (currentAnswers.length > 1) {
          form.setFieldValue('answers', [{ text: currentAnswers[0].text || '', isCorrect: true }]);
        } else if (currentAnswers.length === 1) {
          form.setFieldValue('answers', [{ text: currentAnswers[0].text || '', isCorrect: true }]);
        }
      } else if (selectedQuestionType && selectedQuestionType !== 'Word form') {
        const currentAnswers = form.getFieldValue('answers');
        if (!currentAnswers || currentAnswers.length < 2) {
          const defaultAnswers = [
            { text: currentAnswers?.[0]?.text || '', isCorrect: currentAnswers?.[0]?.isCorrect || false },
            { text: '', isCorrect: false }
          ];
          form.setFieldValue('answers', defaultAnswers);
        }
      }
    }
  }, [selectedQuestionType, open, form]);

  // Lấy user level từ Zustand store để fallback
  const user = useAuthStore((state) => state.user);

  // Hàm lấy danh sách khối lớp (getGradeOptions) phụ thuộc vào giá trị currentUser.level
  const getGradeOptions = (level: string | null | undefined): string[] => {
    if (!level || level === 'N/A') {
      return Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);
    }
    
    const trimmed = level.trim();
    if (trimmed === 'Cấp 1') {
      return ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'];
    } else if (trimmed === 'Cấp 2') {
      return ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'];
    } else if (trimmed === 'Cấp 3') {
      return ['Lớp 10', 'Lớp 11', 'Lớp 12'];
    }
    
    return Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);
  };

  // Fetch danh sách khối lớp được phép từ backend
  useEffect(() => {
    const fetchBlockClasses = async () => {
      try {
        const response = await api.get('/questions/block-classes');
        if (response.data && response.data.success) {
          setBlockClasses(response.data.data);
        } else {
          // Fallback
          setBlockClasses(getGradeOptions(user?.level));
        }
      } catch (error) {
        console.error('Lỗi khi fetch block-classes từ API:', error);
        // Fallback
        setBlockClasses(getGradeOptions(user?.level));
      }
    };

    if (open) {
      fetchBlockClasses();
    }
  }, [open, user?.level]);

  // Set dữ liệu form khi modal mở hoặc thay đổi initialValues
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        form.resetFields();
        const defaultAnswers = [{ text: '', isCorrect: false }, { text: '', isCorrect: false }];
        form.setFieldsValue({ answers: defaultAnswers });
        setParsedAnswers(defaultAnswers);
      } else if (initialValues) {
        // Parse answers nếu là string JSON (phòng hờ dữ liệu cũ)
        const formattedValues = { ...initialValues };
        let answersArray: any[] = [];
        if (typeof formattedValues.answers === 'string') {
          const trimmed = formattedValues.answers.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
            try {
              answersArray = JSON.parse(formattedValues.answers);
            } catch (e) {
              answersArray = [{ text: formattedValues.answers, isCorrect: true }];
            }
          } else {
            answersArray = [{ text: formattedValues.answers, isCorrect: true }];
          }
        } else if (Array.isArray(formattedValues.answers)) {
          answersArray = formattedValues.answers;
        } else if (formattedValues.answers) {
          answersArray = [{ text: String(formattedValues.answers), isCorrect: true }];
        }
        answersArray = answersArray.map((ans: any) => ({
          text: ans.text || '',
          isCorrect: !!ans.isCorrect,
          type: ans.type || 'text',
          image_url: ans.image_url || null
        }));
        formattedValues.answers = answersArray;
        setParsedAnswers(answersArray);
        form.setFieldsValue(formattedValues);
      }
    }
  }, [open, mode, initialValues, form]);

  const handleSaveClick = async () => {
    if (mode === 'detail') {
      onCancel();
      return;
    }

    try {
      const values = await form.validateFields();
      
      // Nếu là dạng Word form, tự động gán isCorrect = true cho đáp án duy nhất và bỏ qua validate chọn đáp án đúng
      if (selectedQuestionType === 'Word form') {
        if (values.answers && values.answers[0]) {
          values.answers[0].isCorrect = true;
          values.answers = [{ text: values.answers[0].text, isCorrect: true }];
        } else {
          values.answers = [{ text: '', isCorrect: true }];
        }
      } else {
        // Kiểm tra xem có ít nhất 1 đáp án đúng không (chỉ đối với các dạng trắc nghiệm thông thường)
        const hasCorrectAnswer = values.answers?.some((ans: QuestionAnswer) => ans.isCorrect);
        if (!hasCorrectAnswer && values.answers?.length > 0) {
          message.warning('Vui lòng chọn ít nhất một đáp án đúng!');
          return;
        }
      }

      setLoading(true);
      await onSave(values);
      form.resetFields();
    } catch (error: any) {
      console.error('Validation/Save Error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message);
      } else if (error.message) {
        // Lỗi validation của form tự hiển thị, ta chỉ hiển thị lỗi server
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock data dropdown
  const skills = ['Vocabulary & Structures', 'Writing', 'Reading', 'Speaking', 'Phonetics'];
  const cognitiveLevels = ['Nhận biết', 'Thông hiểu', 'Vận dụng'];

  const getTitle = () => {
    if (mode === 'create') return 'Thêm câu hỏi mới';
    if (mode === 'edit') return 'Chỉnh sửa câu hỏi';
    return 'Chi tiết câu hỏi';
  };

  const isReadOnly = mode === 'detail';

  return (
    <Modal
      open={open}
      title={<span className="text-lg font-bold text-blue-700">{getTitle()}</span>}
      onCancel={onCancel}
      width={800} // Tăng width để fit dynamic form
      style={{ top: '30px' }}
      destroyOnHidden={true}
      mask={{ closable: false }}
      footer={[
        <Button key="close" onClick={onCancel} disabled={loading} className="rounded-lg">
          Đóng
        </Button>,
        !isReadOnly && (
          <Button
            key="save"
            type="primary"
            loading={loading}
            onClick={handleSaveClick}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg"
          >
            Lưu
          </Button>
        )
      ]}
      className="question-bank-modal"
    >
      <Form
        form={form}
        layout="vertical"
        disabled={isReadOnly}
        className="mt-4"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="block_class"
              label={<span className="font-semibold text-gray-700">Khối lớp</span>}
              rules={[{ required: true, message: 'Vui lòng chọn khối lớp!' }]}
            >
              <Select placeholder="Chọn khối lớp" className="w-full">
                {blockClasses.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="unit"
              label={<span className="font-semibold text-gray-700">Unit</span>}
              rules={[{ required: true, message: 'Vui lòng chọn Unit!' }]}
            >
              <Select placeholder="Chọn Unit" className="w-full">
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
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="skill"
              label={<span className="font-semibold text-gray-700">Kỹ năng</span>}
              rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
            >
              <Select placeholder="Chọn kỹ năng" className="w-full">
                {skills.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="question_type"
              label={<span className="font-semibold text-gray-700">Dạng câu hỏi</span>}
              rules={[{ required: true, message: 'Vui lòng chọn dạng câu hỏi!' }]}
            >
              <Select 
                placeholder={selectedSkill ? "Chọn dạng câu hỏi" : "Vui lòng chọn kỹ năng trước"} 
                className="w-full"
                disabled={!selectedSkill || isReadOnly}
              >
                {selectedSkill && getQuestionTypesBySkill(selectedSkill).map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="cognitive_level"
              label={<span className="font-semibold text-gray-700">Mức độ nhận thức</span>}
              rules={[{ required: true, message: 'Vui lòng chọn mức độ nhận thức!' }]}
            >
              <Select placeholder="Chọn mức độ nhận thức" className="w-full">
                {cognitiveLevels.map((item) => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="requirement"
          label={<span className="font-semibold text-gray-700">Yêu cầu đề bài</span>}
          rules={[{ required: true, message: 'Vui lòng nhập yêu cầu đề bài!' }]}
        >
          <TextArea rows={2} placeholder="Ví dụ: Chọn đáp án đúng nhất để hoàn thành câu sau..." />
        </Form.Item>

        <Form.Item
          name="content"
          label={<span className="font-semibold text-gray-700">Nội dung câu hỏi chi tiết</span>}
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi chi tiết!' }]}
        >
          <TextArea rows={4} placeholder="Ví dụ: Hello, my name ___ Nam." />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="image_url"
              label={<span className="font-semibold text-gray-700">Hình ảnh câu hỏi (nếu có)</span>}
            >
              <Input placeholder="URL hình ảnh..." className="rounded-lg" disabled={mode === 'detail'} />
            </Form.Item>
            {mode !== 'detail' && (
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={async ({ file, onSuccess, onError }) => {
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await api.post('/questions/upload', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    if (res.data && res.data.success) {
                      form.setFieldValue('image_url', res.data.url);
                      message.success('Tải ảnh lên thành công!');
                      onSuccess?.(res.data);
                    } else {
                      throw new Error('Upload failed');
                    }
                  } catch (err: any) {
                    message.error('Tải ảnh thất bại!');
                    onError?.(err);
                  }
                }}
              >
                <Button icon={<UploadOutlined />} className="rounded-lg mb-2">Tải ảnh lên từ máy tính</Button>
              </Upload>
            )}
            <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.image_url !== currentValues.image_url} noStyle>
              {() => {
                const imgUrl = form.getFieldValue('image_url');
                if (!imgUrl) return null;
                return (
                  <div className="mt-2 border rounded-lg p-2 flex items-center justify-between bg-gray-50 max-w-xs">
                    <img src={imgUrl} alt="Preview" style={{ maxHeight: 80, maxWidth: 120, objectFit: 'contain' }} className="rounded border bg-white" />
                    {mode !== 'detail' && (
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => form.setFieldValue('image_url', null)}
                      />
                    )}
                  </div>
                );
              }}
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="audio_url"
              label={<span className="font-semibold text-gray-700">Âm thanh câu hỏi (nếu có)</span>}
            >
              <Input placeholder="URL âm thanh..." className="rounded-lg" disabled={mode === 'detail'} />
            </Form.Item>
            {mode !== 'detail' && (
              <Upload
                accept="audio/*"
                showUploadList={false}
                customRequest={async ({ file, onSuccess, onError }) => {
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await api.post('/questions/upload', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    if (res.data && res.data.success) {
                      form.setFieldValue('audio_url', res.data.url);
                      message.success('Tải âm thanh lên thành công!');
                      onSuccess?.(res.data);
                    } else {
                      throw new Error('Upload failed');
                    }
                  } catch (err: any) {
                    message.error('Tải âm thanh thất bại!');
                    onError?.(err);
                  }
                }}
              >
                <Button icon={<UploadOutlined />} className="rounded-lg mb-2">Tải âm thanh từ máy tính</Button>
              </Upload>
            )}
            <Form.Item shouldUpdate={(prevValues, currentValues) => prevValues.audio_url !== currentValues.audio_url} noStyle>
              {() => {
                const audioUrl = form.getFieldValue('audio_url');
                if (!audioUrl) return null;
                return (
                  <div className="mt-2 border rounded-lg p-2 flex items-center justify-between bg-gray-50 w-full">
                    <audio src={audioUrl} controls className="max-w-full" style={{ height: 32 }} />
                    {mode !== 'detail' && (
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        onClick={() => form.setFieldValue('audio_url', null)}
                      />
                    )}
                  </div>
                );
              }}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="explanation"
          label={<span className="font-semibold text-gray-700">Giải thích / Lời giải chi tiết</span>}
        >
          <TextArea rows={2} placeholder="Nhập lời giải chi tiết hoặc giải thích cho đáp án đúng (không bắt buộc)..." />
        </Form.Item>

        <Divider titlePlacement="start" className="!mt-8 !mb-4">
          <span className="font-bold text-blue-700">Danh sách đáp án <span className="text-red-500">*</span></span>
        </Divider>

        {isReadOnly ? (
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px', 
              marginTop: '16px' 
            }}
          >
            {parsedAnswers.map((ans: any, index: number) => (
              <div 
                key={index} 
                style={{
                  backgroundColor: ans?.isCorrect ? '#f0fdf4' : '#fff1f2',
                  borderColor: ans?.isCorrect ? '#bbf7d0' : '#fecdd3',
                  color: ans?.isCorrect ? '#15803d' : '#be123c',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {ans?.type === 'image' ? (
                    <img src={ans?.image_url} alt={`Đáp án ${index + 1}`} style={{ maxHeight: 60, maxWidth: 100, objectFit: 'contain' }} className="rounded border bg-white" />
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{ans?.text}</span>
                  )}
                </div>
                <span 
                  style={{
                    backgroundColor: ans?.isCorrect ? '#dcfce7' : '#ffe4e6',
                    color: ans?.isCorrect ? '#166534' : '#9f1239',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {ans?.isCorrect ? '✓ Đáp án đúng' : '✗ Đáp án sai'}
                </span>
              </div>
            ))}
            {(!parsedAnswers || parsedAnswers.length === 0) && (
              <span className="text-gray-400 italic">Không có đáp án nào được cấu hình cho câu hỏi này.</span>
            )}
          </div>
        ) : selectedQuestionType === 'Word form' ? (
          <div className="mt-4">
            <Form.Item
              name={['answers', 0, 'text']}
              rules={[{ required: true, message: 'Vui lòng nhập đáp án cho Word form!' }]}
            >
              <Input placeholder="Nhập đáp án đúng cho câu hỏi Word form..." className="rounded-lg h-10" />
            </Form.Item>
          </div>
        ) : (
          <Form.List 
            name="answers"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 2) {
                    return Promise.reject(new Error('Vui lòng thêm ít nhất 2 đáp án!'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div 
                    key={key} 
                    className="p-4 mb-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm flex flex-col gap-3 relative"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-600">Đáp án {name + 1}</span>
                      
                      <Form.Item
                        {...restField}
                        name={[name, 'type']}
                        initialValue="text"
                        className="mb-0"
                      >
                        <Radio.Group size="small" disabled={isReadOnly}>
                          <Radio.Button value="text">Chữ</Radio.Button>
                          <Radio.Button value="image">Hình ảnh</Radio.Button>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'isCorrect']}
                        valuePropName="checked"
                        initialValue={false}
                        className="mb-0 ml-auto"
                      >
                        <Checkbox className="font-medium text-gray-600" disabled={isReadOnly}>Đúng</Checkbox>
                      </Form.Item>

                      {!isReadOnly && (
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />} 
                          onClick={() => remove(name)}
                          title="Xóa đáp án"
                          size="small"
                        />
                      )}
                    </div>

                    <Form.Item shouldUpdate noStyle>
                      {() => {
                        const ansType = form.getFieldValue(['answers', name, 'type']) || 'text';
                        if (ansType === 'text') {
                          return (
                            <Form.Item
                              {...restField}
                              name={[name, 'text']}
                              rules={[{ required: true, message: 'Vui lòng nhập nội dung đáp án!' }]}
                              className="mb-0 flex-grow"
                            >
                              <Input placeholder="Nhập nội dung đáp án..." className="rounded-lg h-10 w-full" disabled={isReadOnly} />
                            </Form.Item>
                          );
                        } else {
                          return (
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex items-center gap-2 w-full">
                                <Form.Item
                                  {...restField}
                                  name={[name, 'image_url']}
                                  rules={[{ required: true, message: 'Vui lòng tải ảnh lên hoặc nhập URL!' }]}
                                  className="mb-0 flex-grow"
                                >
                                  <Input placeholder="URL hình ảnh đáp án..." className="rounded-lg h-10 w-full" disabled={isReadOnly} />
                                </Form.Item>
                                {!isReadOnly && (
                                  <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    customRequest={async ({ file, onSuccess, onError }) => {
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      try {
                                        const res = await api.post('/questions/upload', formData, {
                                          headers: { 'Content-Type': 'multipart/form-data' }
                                        });
                                        if (res.data && res.data.success) {
                                          form.setFieldValue(['answers', name, 'image_url'], res.data.url);
                                          form.setFieldValue(['answers', name, 'text'], '');
                                          message.success('Tải ảnh đáp án lên thành công!');
                                          onSuccess?.(res.data);
                                        } else {
                                          throw new Error('Upload failed');
                                        }
                                      } catch (err: any) {
                                        message.error('Tải ảnh đáp án thất bại!');
                                        onError?.(err);
                                      }
                                    }}
                                  >
                                    <Button icon={<UploadOutlined />} className="h-10 rounded-lg">Tải ảnh lên</Button>
                                  </Upload>
                                )}
                              </div>
                              
                              <Form.Item shouldUpdate noStyle>
                                {() => {
                                  const imgUrl = form.getFieldValue(['answers', name, 'image_url']);
                                  if (!imgUrl) return null;
                                  return (
                                    <div className="mt-1 border rounded-lg p-2 max-w-xs flex items-center justify-between bg-white shadow-sm">
                                      <img src={imgUrl} alt="Đáp án" style={{ maxHeight: 60, maxWidth: 100, objectFit: 'contain' }} className="rounded border bg-white" />
                                      {!isReadOnly && (
                                        <Button 
                                          type="text" 
                                          danger 
                                          icon={<DeleteOutlined />} 
                                          onClick={() => form.setFieldValue(['answers', name, 'image_url'], null)}
                                        />
                                      )}
                                    </div>
                                  );
                                }}
                              </Form.Item>
                            </div>
                          );
                        }
                      }}
                    </Form.Item>
                  </div>
                ))}

                {!isReadOnly && (
                  <Form.Item className="mt-4">
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      block 
                      icon={<PlusOutlined />}
                      className="h-10 border-blue-400 text-blue-600 hover:text-blue-700 hover:border-blue-500 rounded-lg"
                    >
                      Thêm đáp án
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        )}
      </Form>
    </Modal>
  );
};

export default QuestionModal;
