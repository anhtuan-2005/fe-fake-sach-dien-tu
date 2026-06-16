import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const StudentExercises: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto">
      <Card className="border-0 shadow-sm rounded-xl">
        <Title level={3} className="text-gray-700 font-bold">Bài tập luyện tập</Title>
        <Paragraph className="text-gray-500">
          Danh sách bài tập và bài kiểm tra thầy cô giao cho bạn. Tính năng đang được hoàn thiện.
        </Paragraph>
      </Card>
    </div>
  );
};

export default StudentExercises;
