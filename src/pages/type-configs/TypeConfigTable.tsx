import React from 'react';
import { Table, Button, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export interface ExerciseType {
  id: number;
  school_level: 'Tieu hoc' | 'THCS' | 'THPT';
  parent_id: number | null;
  name: string;
  vietnamese_title: string | null;
  code: string;
  answer_type_code: 'single' | 'multiple' | null;
  skill: 'Vocabulary & Structures' | 'Writing' | 'Listening' | 'Reading' | 'Speaking' | 'Phonetics' | null;
  children?: ExerciseType[];
}

interface TypeConfigTableProps {
  data: ExerciseType[];
  onEdit: (record: ExerciseType) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export const TypeConfigTable: React.FC<TypeConfigTableProps> = ({
  data,
  onEdit,
  onDelete,
  loading
}) => {
  const columns = [
    {
      title: 'Cấp học',
      dataIndex: 'school_level',
      key: 'school_level',
      width: 120,
      render: (level: string) => {
        let color = 'blue';
        if (level === 'Tieu hoc') color = 'green';
        if (level === 'THCS') color = 'orange';
        if (level === 'THPT') color = 'red';
        return <Tag color={color}>{level}</Tag>;
      }
    },
    {
      title: 'Tên loại bài tập',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã loại bài tập',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <code style={{ fontWeight: 600 }}>{code}</code>
    },
    {
      title: 'Mã kiểu đáp án',
      dataIndex: 'answer_type_code',
      key: 'answer_type_code',
      width: 180,
      render: (code: string | null) => {
        if (!code) return <span style={{ color: '#94a3b8' }}>-</span>;
        return <Tag color="geekblue">{code === 'single' ? 'Chọn 1 đáp án' : 'Chọn nhiều đáp án'}</Tag>;
      }
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      width: 200,
      render: (skill: string | null) => {
        if (!skill) return <span style={{ color: '#94a3b8' }}>-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {skill.split(',').map((s: string, idx: number) => (
              <Tag key={idx} color="purple">{s.trim()}</Tag>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: ExerciseType) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#f59e0b' }} />}
              onClick={() => onEdit(record)}
              className="hover:bg-amber-50"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa loại bài tập này không?"
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: '#ef4444' }} />}
                className="hover:bg-red-50"
              />
            </Popconfirm>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={false}
      scroll={{ x: 'max-content' }}
      className="exercise-type-tree-table"
      expandable={{
        defaultExpandAllRows: true
      }}
    />
  );
};

export default TypeConfigTable;
