import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const StudentBooks: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto">
      <Card className="border-0 shadow-sm rounded-xl">
        <Title level={3} className="text-gray-700 font-bold">Thư viện sách điện tử</Title>
        <Paragraph className="text-gray-500">
          Danh sách sách giáo khoa và tài liệu tham khảo dành riêng cho bạn. Tính năng đang được hoàn thiện.
        </Paragraph>
      </Card>
    </div>
  );
};

export default StudentBooks;
