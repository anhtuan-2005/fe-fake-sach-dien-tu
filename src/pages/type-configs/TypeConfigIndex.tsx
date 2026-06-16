import React, { useEffect, useState } from 'react';
import { Card, Button, Typography, App, Row, Col, Tree, Popconfirm, Tag } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';
import api from '../../api';
import { ExerciseType } from './TypeConfigTable';
import TypeConfigModal from './TypeConfigModal';

const { Title } = Typography;

export const TypeConfigIndex: React.FC = () => {
  const { message } = App.useApp();
  const [treeData, setTreeData] = useState<ExerciseType[]>([]);
  const [parentOptions, setParentOptions] = useState<ExerciseType[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<ExerciseType | null>(null);
  const [defaultCreateValues, setDefaultCreateValues] = useState<{ school_level?: 'Tieu hoc' | 'THCS' | 'THPT'; parent_id?: number | null } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch dữ liệu cây và danh sách thư mục cha từ backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/exercise-types');
      if (response.data && response.data.success) {
        const data = response.data.data;
        setTreeData(data);
        
        // Danh sách thư mục cha là các bản ghi gốc (parent_id = null)
        // Trong cấu trúc cây trả về, các phần tử ở cấp cao nhất chính là các bản ghi gốc
        setParentOptions(data);
      } else {
        message.error(response.data.message || 'Không thể lấy danh sách loại bài tập.');
      }
    } catch (error: any) {
      console.error('Lỗi khi fetch loại bài tập:', error);
      message.error(error.response?.data?.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal tạo mới với giá trị mặc định
  const handleCreate = (defaultValues?: { school_level?: 'Tieu hoc' | 'THCS' | 'THPT'; parent_id?: number | null }) => {
    setEditingRecord(null);
    setDefaultCreateValues(defaultValues || null);
    setModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEdit = (record: ExerciseType) => {
    setEditingRecord(record);
    setDefaultCreateValues(null);
    setModalOpen(true);
  };

  // Xử lý xóa loại bài tập
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const response = await api.delete(`/exercise-types/${id}`);
      if (response.data && response.data.success) {
        message.success('Xóa loại bài tập thành công.');
        await fetchData();
      } else {
        message.error(response.data.message || 'Xóa loại bài tập thất bại.');
      }
    } catch (error: any) {
      console.error('Lỗi khi xóa loại bài tập:', error);
      message.error(error.response?.data?.message || 'Lỗi khi thực hiện xóa loại bài tập.');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tạo mới hoặc cập nhật khi submit form từ Modal
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (editingRecord) {
        // Gửi yêu cầu PUT để cập nhật
        const response = await api.put(`/exercise-types/${editingRecord.id}`, values);
        if (response.data && response.data.success) {
          message.success('Cập nhật thông tin loại bài tập thành công.');
          setModalOpen(false);
          await fetchData();
        } else {
          message.error(response.data.message || 'Cập nhật loại bài tập thất bại.');
        }
      } else {
        // Gửi yêu cầu POST để tạo mới
        const response = await api.post('/exercise-types', values);
        if (response.data && response.data.success) {
          message.success('Thêm mới loại bài tập thành công.');
          setModalOpen(false);
          await fetchData();
        } else {
          message.error(response.data.message || 'Thêm mới loại bài tập thất bại.');
        }
      }
    } catch (error: any) {
      console.error('Lỗi khi gửi dữ liệu loại bài tập:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm đệ quy chuyển dữ liệu loại bài tập sang cấu trúc cây của Ant Design
  const getAntdTreeData = (nodes: ExerciseType[]): any[] => {
    return nodes.map((node) => ({
      key: node.id,
      title: (
        <div className="flex items-center justify-between w-full group py-1 pr-2 rounded transition-colors hover:bg-slate-50">
          <div className="flex items-center gap-2">
            {node.parent_id === null ? (
              <FolderOpenOutlined className="text-blue-500 text-sm" />
            ) : (
              <FileTextOutlined className="text-gray-400 text-xs" />
            )}
            <span className="font-semibold text-gray-700 text-sm">
              {node.vietnamese_title ? `${node.name} - ${node.vietnamese_title}` : node.name}
            </span>
            {node.parent_id !== null && (
              <span className="text-xs text-gray-400 font-mono">({node.code})</span>
            )}
            {node.parent_id !== null && (
              <div className="flex items-center gap-1 ml-2 flex-wrap">
                {node.answer_type_code && (
                  <Tag color="geekblue" className="text-[10px] px-1 py-0 m-0 border-0 leading-normal">
                    {node.answer_type_code === 'single' ? '1 đáp án' : 'Nhiều đáp án'}
                  </Tag>
                )}
                {node.skill && node.skill.split(',').map((s: string, sIdx: number) => (
                  <Tag key={sIdx} color="purple" className="text-[10px] px-1 py-0 m-0 border-0 leading-normal">
                    {s.trim()}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {/* Cụm nút thao tác (luôn hiển thị rõ ràng để dễ nhận biết) */}
          <div className="flex items-center gap-1.5 action-buttons ml-4">
            {node.parent_id === null && (
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined className="text-blue-600" />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreate({ school_level: node.school_level, parent_id: node.id });
                }}
                className="h-6 w-6 p-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors"
                title="Thêm loại con"
              />
            )}
            {node.parent_id !== null && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined className="text-amber-500" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(node);
                  }}
                  className="h-6 w-6 p-0 flex items-center justify-center bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded transition-colors"
                  title="Sửa"
                />
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa loại bài tập này không?"
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDelete(node.id);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined className="text-red-500" />}
                    onClick={(e) => e.stopPropagation()}
                    className="h-6 w-6 p-0 flex items-center justify-center bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors"
                    title="Xóa"
                  />
                </Popconfirm>
              </>
            )}
          </div>
        </div>
      ),
      children: node.children ? getAntdTreeData(node.children) : undefined
    }));
  };

  return (
    <div className="p-6 min-h-screen bg-[#f0f2f5] md:p-8">
      {/* Tiêu đề & Cụm chuyển đổi chế độ xem */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <Title level={2} className="m-0 text-blue-800 font-bold" style={{ color: '#1e3a8a' }}>
            Quản lý Loại Bài Tập
          </Title>
          <p className="text-gray-500 m-0 mt-1">
            Thiết lập cấu trúc cây phân cấp các loại bài tập và phương pháp đánh giá của hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleCreate()}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-lg h-10 px-6 font-semibold flex items-center justify-center shadow-md"
          >
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Giao diện chia làm 3 cột */}
      <Row gutter={[24, 24]}>
          {/* Cột 1: Tiểu học */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-bold text-emerald-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                    Tiểu học
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusCircleOutlined className="text-emerald-600 hover:text-emerald-700 text-lg" />}
                    onClick={() => handleCreate({ school_level: 'Tieu hoc', parent_id: null })}
                    title="Thêm thư mục gốc Tiểu học"
                    className="p-0 flex items-center justify-center hover:scale-110 transition-transform"
                  />
                </div>
              }
              className="shadow-sm border-0 h-full rounded-2xl"
              styles={{ body: { padding: '16px' } }}
            >
              <div 
                className="p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20"
                style={{ minHeight: '520px', maxHeight: '720px', overflowY: 'auto' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-[450px] text-gray-400">Đang tải...</div>
                ) : treeData.filter((item) => item.school_level === 'Tieu hoc').length === 0 ? (
                  <div className="flex items-center justify-center h-[450px] text-gray-400 text-sm">Chưa có loại bài tập</div>
                ) : (
                  <Tree
                    treeData={getAntdTreeData(treeData.filter((item) => item.school_level === 'Tieu hoc'))}
                    blockNode
                    selectable={false}
                    defaultExpandAll
                    showLine={{ showLeafIcon: false }}
                    className="bg-transparent"
                    expandAction="click"
                  />
                )}
              </div>
            </Card>
          </Col>

          {/* Cột 2: THCS */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-bold text-amber-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                    THCS
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusCircleOutlined className="text-amber-600 hover:text-amber-700 text-lg" />}
                    onClick={() => handleCreate({ school_level: 'THCS', parent_id: null })}
                    title="Thêm thư mục gốc THCS"
                    className="p-0 flex items-center justify-center hover:scale-110 transition-transform"
                  />
                </div>
              }
              className="shadow-sm border-0 h-full rounded-2xl"
              styles={{ body: { padding: '16px' } }}
            >
              <div 
                className="p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20"
                style={{ minHeight: '520px', maxHeight: '720px', overflowY: 'auto' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-[450px] text-gray-400">Đang tải...</div>
                ) : treeData.filter((item) => item.school_level === 'THCS').length === 0 ? (
                  <div className="flex items-center justify-center h-[450px] text-gray-400 text-sm">Chưa có loại bài tập</div>
                ) : (
                  <Tree
                    treeData={getAntdTreeData(treeData.filter((item) => item.school_level === 'THCS'))}
                    blockNode
                    selectable={false}
                    defaultExpandAll
                    showLine={{ showLeafIcon: false }}
                    className="bg-transparent"
                    expandAction="click"
                  />
                )}
              </div>
            </Card>
          </Col>

          {/* Cột 3: THPT */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-base font-bold text-blue-700 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    THPT
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusCircleOutlined className="text-blue-600 hover:text-blue-700 text-lg" />}
                    onClick={() => handleCreate({ school_level: 'THPT', parent_id: null })}
                    title="Thêm thư mục gốc THPT"
                    className="p-0 flex items-center justify-center hover:scale-110 transition-transform"
                  />
                </div>
              }
              className="shadow-sm border-0 h-full rounded-2xl"
              styles={{ body: { padding: '16px' } }}
            >
              <div 
                className="p-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20"
                style={{ minHeight: '520px', maxHeight: '720px', overflowY: 'auto' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-[450px] text-gray-400">Đang tải...</div>
                ) : treeData.filter((item) => item.school_level === 'THPT').length === 0 ? (
                  <div className="flex items-center justify-center h-[450px] text-gray-400 text-sm">Chưa có loại bài tập</div>
                ) : (
                  <Tree
                    treeData={getAntdTreeData(treeData.filter((item) => item.school_level === 'THPT'))}
                    blockNode
                    selectable={false}
                    defaultExpandAll
                    showLine={{ showLeafIcon: false }}
                    className="bg-transparent"
                    expandAction="click"
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>

      {/* Modal chỉnh sửa / thêm mới */}
      <TypeConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
        defaultCreateValues={defaultCreateValues}
        parentOptions={parentOptions}
        loading={loading}
      />

      <style>{`
        .ant-tree .ant-tree-node-content-wrapper {
          width: 100%;
          cursor: pointer;
        }
        .ant-tree .ant-tree-node-content-wrapper:hover {
          background-color: transparent;
        }
        .ant-tree .ant-tree-treenode {
          width: 100%;
          align-items: center;
        }
        .ant-tree .ant-tree-indent-unit {
          width: 20px;
        }
      `}</style>
    </div>
  );
};

export default TypeConfigIndex;
