import React, { useState } from 'react';
import { Avatar, Upload, Button, App, Tooltip } from 'antd';
import { UploadOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import api from '../../../../api';
import { ApiResponse } from '../../../../types';

interface ProfileAvatarProps {
  avatarUrl?: string;
  onUploadSuccess: (newUrl: string) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ avatarUrl, onUploadSuccess }) => {
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
          size={{ xs: 120, sm: 150, md: 180, lg: 200, xl: 220, xxl: 250 }}
          src={avatarUrl}
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
              className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-md border-2 border-white"
            />
          </Tooltip>
        </Upload>
      </div>
      
      <div className="text-center">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />} loading={loading} type="dashed">
            Chọn ảnh mới
          </Button>
        </Upload>
        <p className="text-gray-400 text-xs mt-2 italic">
          Định dạng hỗ trợ: JPG, PNG, WEBP (Tối đa 2MB)
        </p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
