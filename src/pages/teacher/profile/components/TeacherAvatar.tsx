import React, { useState } from 'react';
import { Avatar, Upload, Button, App, Tooltip, Typography } from 'antd';
import { UploadOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import api from '../../../../api';
import { ApiResponse, User } from '../../../../types';

const { Title, Text } = Typography;

interface TeacherAvatarProps {
  user: User | null;
  onUploadSuccess: (newUrl: string) => void;
}

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ user, onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    multiple: false,
    customRequest: async (options) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append('avatar', file);

      setLoading(true);
      try {
        const response = await api.post<ApiResponse<{ url: string }>>('/users/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success && response.data.data) {
          const newUrl = response.data.data.url;
          onUploadSuccess(newUrl);
          message.success('Cập nhật ảnh đại diện thành công!');
          onSuccess?.(response.data);
        } else {
          throw new Error(response.data.message || 'Upload thất bại');
        }
      } catch (error: any) {
        console.error('Upload avatar error:', error);
        message.error(error.response?.data?.message || 'Không thể tải ảnh lên. Vui lòng thử lại sau.');
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative group">
        <Avatar
          size={{ xs: 120, sm: 150, md: 180, lg: 190 }}
          src={user?.avatar_url || undefined}
          icon={<UserOutlined />}
          className="shadow-lg border-4 border-white transition-transform duration-300 group-hover:scale-105"
        />
        <Upload {...uploadProps}>
          <Tooltip title="Thay đổi ảnh đại diện">
            <Button
              type="primary"
              shape="circle"
              icon={<CameraOutlined />}
              loading={loading}
              className="absolute bottom-2 right-2 w-10 h-10 flex items-center justify-center shadow-md border-2 border-white bg-blue-600 border-none hover:bg-blue-700"
            />
          </Tooltip>
        </Upload>
      </div>
      
      <div className="text-center w-full">
        <Title level={4} className="!mb-1 font-bold text-gray-700">{user?.full_name}</Title>
        <Text type="secondary" className="block mb-4 text-xs">{user?.email}</Text>
        
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={loading} type="dashed" className="rounded-lg">
            Chọn ảnh mới
          </Button>
        </Upload>
        <p className="text-gray-400 text-[11px] mt-2 italic">
          Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 2MB)
        </p>
      </div>
    </div>
  );
};

export default TeacherAvatar;
