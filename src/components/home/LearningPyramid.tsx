import React from 'react';
import { Check } from 'lucide-react';
import './LearningPyramid.css';

interface PyramidItem {
  percent: string;
  text: string;
  color: string;
}

const LearningPyramid: React.FC = () => {
  const pyramidData: PyramidItem[] = [
    { percent: '5%', text: 'Là mức độ ghi nhớ khi bạn Được nghe giảng', color: '#1565c0' },
    { percent: '10%', text: 'Là mức độ ghi nhớ khi bạn Đọc', color: '#1976d2' },
    { percent: '20%', text: 'Là mức độ ghi nhớ khi bạn Xem video', color: '#0288d1' },
    { percent: '30%', text: 'Là mức độ ghi nhớ khi bạn Thấy thực tế', color: '#03a9f4' },
    { percent: '50%', text: 'Là mức độ ghi nhớ khi bạn Thảo luận nhóm', color: '#26a69a' },
    { percent: '70%', text: 'Là mức độ ghi nhớ khi bạn Thực hành', color: '#4caf50' },
    { percent: '90%', text: 'Là mức độ ghi nhớ khi bạn Dạy lại người khác', color: '#66bb6a' },
  ];

  return (
    <section className="learning-pyramid">
      <div className="pyramid-container">
        <div className="pyramid-graphic-section">
          <div className="pyramid-labels">
            <span className="label-passive">Phương pháp dạy thụ động</span>
            <div className="divider"></div>
            <span className="label-active">Phương pháp dạy chủ động</span>
          </div>
          <div className="pyramid-visual">
            {pyramidData.map((item, index) => (
              <div 
                key={index} 
                className="pyramid-level" 
                style={{ 
                  backgroundColor: item.color,
                  width: `${30 + index * 10}%` 
                }}
              >
                <span className="level-percent">{item.percent}</span>
                <span className="level-text">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pyramid-info-box">
          <h2 className="info-title">Phương pháp học Tiếng Anh dựa theo "Tháp học tập"</h2>
          <ul className="info-list">
            <li>
              <Check className="check-icon" size={20} />
              <span>Hệ thống bài học được thiết kế công phu, khoa học và hấp dẫn, giúp học viên học sâu qua các chủ đề giao tiếp thông dụng</span>
            </li>
            <li>
              <Check className="check-icon" size={20} />
              <span>Giúp học viên ghi nhớ lâu những kiến thức được học thông qua trải nghiệm trực tiếp và quá trình lặp đi lặp lại nhiều lần</span>
            </li>
            <li>
              <Check className="check-icon" size={20} />
              <span>Bằng việc ứng dụng hình ảnh, âm thanh, hành động và cảm xúc vào việc học từ vựng, học viên sẽ ghi nhớ từ vựng lâu hơn, hiệu quả hơn và có hứng thú hơn khi học</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LearningPyramid;
