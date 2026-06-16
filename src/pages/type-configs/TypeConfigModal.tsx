import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { ExerciseType } from './TypeConfigTable';

const { Option } = Select;

interface TypeConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues: ExerciseType | null;
  defaultCreateValues?: { school_level?: 'Tieu hoc' | 'THCS' | 'THPT'; parent_id?: number | null } | null;
  parentOptions: ExerciseType[];
  loading: boolean;
}

export const TypeConfigModal: React.FC<TypeConfigModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  defaultCreateValues,
  parentOptions,
  loading
}) => {
  const [form] = Form.useForm();

  // Dùng useWatch để theo dõi trường parent_id và school_level phục vụ logic đồng bộ
  const parentId = Form.useWatch('parent_id', form);
  const schoolLevel = Form.useWatch('school_level', form);
  const showConditionalFields = parentId !== undefined && parentId !== null && parentId !== 'root';

  // Điền dữ liệu khi mở Modal sửa hoặc xóa trắng khi thêm mới
  useEffect(() => {
    if (open) {
      if (initialValues) {
        const skillArray = initialValues.skill 
          ? initialValues.skill.split(',').map((s: any) => s.trim()).filter(Boolean)
          : [];
        form.setFieldsValue({
          school_level: initialValues.school_level,
          parent_id: initialValues.parent_id === null ? 'root' : initialValues.parent_id,
          name: initialValues.name,
          vietnamese_title: initialValues.vietnamese_title || '',
          code: initialValues.code,
          answer_type_code: initialValues.answer_type_code,
          skill: skillArray
        });
      } else {
        form.resetFields();
        if (defaultCreateValues) {
          form.setFieldsValue({
            school_level: defaultCreateValues.school_level,
            parent_id: defaultCreateValues.parent_id !== undefined && defaultCreateValues.parent_id !== null ? defaultCreateValues.parent_id : 'root',
            name: '',
            vietnamese_title: '',
            code: '',
            answer_type_code: null,
            skill: null
          });
        }
      }
    }
  }, [open, initialValues, defaultCreateValues, form]);

  // Tự động reset parent_id về 'root' nếu thay đổi school_level khác với school_level của thư mục cha hiện tại
  useEffect(() => {
    if (schoolLevel) {
      const currentParentId = form.getFieldValue('parent_id');
      if (currentParentId && currentParentId !== 'root') {
        const parent = parentOptions.find(p => p.id === currentParentId);
        if (parent && parent.school_level !== schoolLevel) {
          form.setFieldValue('parent_id', 'root');
        }
      }
    }
  }, [schoolLevel, parentOptions, form]);

  // Xóa giá trị của mã kiểu đáp án và kỹ năng nếu parent_id chuyển về 'root'
  useEffect(() => {
    if (parentId === null || parentId === undefined || parentId === 'root') {
      form.setFieldsValue({
        answer_type_code: null,
        skill: null
      });
    }
  }, [parentId, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        parent_id: values.parent_id === 'root' ? null : values.parent_id,
        skill: values.skill && values.skill.length > 0 ? values.skill.join(', ') : null
      };
      await onSubmit(payload);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // Lọc danh sách thư mục cha:
  // 1. Chỉ lấy các mục có school_level khớp với schoolLevel hiện tại
  // 2. Không hiển thị chính bản ghi đang chỉnh sửa làm cha của chính nó
  // 3. Chỉ lấy các thư mục gốc (parent_id === null)
  const filteredParentOptions = parentOptions.filter(item => {
    const isDifferentId = !initialValues || item.id !== initialValues.id;
    const isSameSchoolLevel = !schoolLevel || item.school_level === schoolLevel;
    const isRoot = item.parent_id === null;
    return isDifferentId && isSameSchoolLevel && isRoot;
  });

  return (
    <Modal
      title={
        <span className="text-lg font-bold text-blue-700">
          {initialValues ? 'Chỉnh sửa loại bài tập' : 'Thêm mới loại bài tập'}
        </span>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy"
      width={650}
      style={{ top: '30px' }} // Dịch chuyển modal lên trên tránh bị dính dưới chân trang
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '16px' }}
      >
        {/* Trường 1: Cấp học */}
        <Form.Item
          name="school_level"
          label={<span className="font-semibold text-gray-700">Cấp học</span>}
          rules={[{ required: true, message: 'Vui lòng chọn cấp học!' }]}
        >
          <Select placeholder="Chọn cấp học">
            <Option value="Tieu hoc">Tiểu học</Option>
            <Option value="THCS">Trung học cơ sở</Option>
            <Option value="THPT">Trung học phổ thông</Option>
          </Select>
        </Form.Item>

        {/* Trường 2: Thư mục cha */}
        <Form.Item
          name="parent_id"
          label={<span className="font-semibold text-gray-700">Thư mục cha</span>}
          rules={[{ required: true, message: 'Vui lòng chọn thư mục cha!' }]}
          initialValue="root"
        >
          <Select
            placeholder={schoolLevel ? "Chọn thư mục cha hoặc chọn Gốc" : "Vui lòng chọn cấp học trước"}
            disabled={!schoolLevel}
          >
            <Option value="root">— Là Thư mục Gốc (không có cha) —</Option>
            {filteredParentOptions.map(item => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Trường 3: Tên loại bài tập */}
        <Form.Item
          name="name"
          label={<span className="font-semibold text-gray-700">Tên loại bài tập</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tên loại bài tập!' }]}
        >
          <Input placeholder="Ví dụ: Từ vựng & Ngữ pháp, Trắc nghiệm chọn từ" />
        </Form.Item>

        {/* Trường Tiêu đề tiếng Việt */}
        <Form.Item
          name="vietnamese_title"
          label={<span className="font-semibold text-gray-700">Tiêu đề tiếng Việt</span>}
          rules={[{ required: true, message: 'Vui lòng nhập tiêu đề tiếng Việt!' }]}
        >
          <Input placeholder="Ví dụ: Trắc nghiệm chọn từ, Điền vào chỗ trống" />
        </Form.Item>

        {/* Trường 4: Mã loại bài tập */}
        <Form.Item
          name="code"
          label={<span className="font-semibold text-gray-700">Mã loại bài tập</span>}
          rules={[{ required: true, message: 'Vui lòng nhập mã loại bài tập!' }]}
        >
          <Input placeholder="Ví dụ: MCQ_VOCAB_PRIMARY" disabled={!!initialValues} />
        </Form.Item>

        {/* Trường 5 (Hiển thị có điều kiện): Mã kiểu đáp án */}
        {showConditionalFields && (
          <Form.Item
            name="answer_type_code"
            label={<span className="font-semibold text-gray-700">Mã kiểu đáp án</span>}
            rules={[{ required: true, message: 'Vui lòng chọn kiểu đáp án!' }]}
          >
            <Select placeholder="Chọn kiểu đáp án">
              <Option value="single">Chọn 1 đáp án (single)</Option>
              <Option value="multiple">Chọn nhiều đáp án (multiple)</Option>
            </Select>
          </Form.Item>
        )}

        {/* Trường 6 (Hiển thị có điều kiện): Kỹ năng */}
        {showConditionalFields && (
          <Form.Item
            name="skill"
            label={<span className="font-semibold text-gray-700">Kỹ năng</span>}
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kỹ năng!' }]}
          >
            <Select mode="multiple" placeholder="Chọn một hoặc nhiều kỹ năng">
              <Option value="Vocabulary & Structures">Vocabulary & Structures</Option>
              <Option value="Writing">Writing</Option>
              <Option value="Listening">Listening</Option>
              <Option value="Reading">Reading</Option>
              <Option value="Speaking">Speaking</Option>
              <Option value="Phonetics">Phonetics</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default TypeConfigModal;
