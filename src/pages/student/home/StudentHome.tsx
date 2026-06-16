import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Breadcrumb, Tabs, Table, Progress, Tag, Typography } from 'antd';
import { HomeOutlined, BookOutlined, TrophyOutlined, BarChartOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

// Mock data 12 tháng gần nhất
const chartData = [
  { month: 'T6/25', value: 45 },
  { month: 'T7/25', value: 50 },
  { month: 'T8/25', value: 60 },
  { month: 'T9/25', value: 75 },
  { month: 'T10/25', value: 80 },
  { month: 'T11/25', value: 85 },
  { month: 'T12/25', value: 90 },
  { month: 'T1/26', value: 70 },
  { month: 'T2/26', value: 78 },
  { month: 'T3/26', value: 82 },
  { month: 'T4/26', value: 88 },
  { month: 'T5/26', value: 95 }
];

// Interface cho bảng lớp học
interface OngoingClass {
  key: string;
  className: string;
  teacherName: string;
  progress: number;
}

interface CompletedClass {
  key: string;
  className: string;
  endDate: string;
  result: string;
  score: number;
}

export const StudentHome: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mock data lớp đang học
  const ongoingClasses: OngoingClass[] = [
    { key: '1', className: 'Tiếng Anh Lớp 5 - Học Kỳ 2', teacherName: 'Nguyễn Thị Hương', progress: 75 },
    { key: '2', className: 'Luyện kỹ năng Nghe - Nói Lớp 5', teacherName: 'Trần Văn Hoàng', progress: 40 },
    { key: '3', className: 'Từ vựng Tiếng Anh Nâng cao', teacherName: 'Lê Mai Anh', progress: 90 }
  ];

  // Mock data lớp đã hoàn thành
  const completedClasses: CompletedClass[] = [
    { key: '1', className: 'Tiếng Anh Lớp 5 - Học Kỳ 1', endDate: '15/01/2026', result: 'Hoàn thành xuất sắc', score: 9.2 },
    { key: '2', className: 'Ngữ pháp Tiếng Anh cơ bản', endDate: '20/12/2025', result: 'Đạt', score: 7.8 }
  ];

  const ongoingColumns = [
    {
      title: 'Tên lớp học',
      dataIndex: 'className',
      key: 'className',
      render: (text: string) => <span className="font-semibold text-gray-700">{text}</span>
    },
    {
      title: 'Giáo viên phụ trách',
      dataIndex: 'teacherName',
      key: 'teacherName',
      render: (text: string) => (
        <span>
          <UserOutlined className="mr-2 text-gray-400" />
          {text}
        </span>
      )
    },
    {
      title: 'Tiến độ học tập',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <div style={{ width: '80%' }}>
          <Progress 
            percent={progress} 
            strokeColor={{
              '0%': '#10b981',
              '100%': '#059669'
            }} 
            status="active"
          />
        </div>
      )
    }
  ];

  const completedColumns = [
    {
      title: 'Tên lớp học',
      dataIndex: 'className',
      key: 'className',
      render: (text: string) => <span className="font-semibold text-gray-700">{text}</span>
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text: string) => <span className="text-gray-500">{text}</span>
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result: string) => {
        const color = result.includes('xuất sắc') ? 'gold' : 'green';
        return <Tag color={color} className="font-medium px-3 py-0.5 rounded-full">{result}</Tag>;
      }
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => <span className="font-bold text-blue-600">{score} / 10</span>
    }
  ];

  const tabItems = [
    {
      key: '1',
      label: <span className="font-medium">Lớp đang học</span>,
      children: (
        <Table 
          columns={ongoingColumns} 
          dataSource={ongoingClasses} 
          pagination={false} 
          className="border border-gray-100 rounded-xl overflow-hidden"
        />
      )
    },
    {
      key: '2',
      label: <span className="font-medium">Lớp đã hoàn thành</span>,
      children: (
        <Table 
          columns={completedColumns} 
          dataSource={completedClasses} 
          pagination={false} 
          className="border border-gray-100 rounded-xl overflow-hidden"
        />
      )
    }
  ];

  // SVG Chart Dimensions
  const svgWidth = 800;
  const svgHeight = 350;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 50;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Tính tọa độ cho mỗi điểm dữ liệu
  const points = chartData.map((d, index) => {
    const x = paddingLeft + (index * chartWidth) / (chartData.length - 1);
    const y = paddingTop + chartHeight * (1 - d.value / 100);
    return { x, y, month: d.month, value: d.value };
  });

  // Tạo chuỗi đường nối d="..." cho thẻ <path>
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Tạo chuỗi vùng phủ d="..." cho Area chart (đổ màu mờ phía dưới)
  const areaPath = `
    ${linePath} 
    L ${points[points.length - 1].x} ${paddingTop + chartHeight} 
    L ${points[0].x} ${paddingTop + chartHeight} 
    Z
  `;

  // Mốc kẻ ngang cho trục Y (20%, 40%, 60%, 80%, 100%)
  const yGridTicks = [0, 20, 40, 60, 80, 100];

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + 15;
    const y = e.clientY - rect.top - 40;
    setTooltipPos({ x, y });
    setHoveredIndex(index);
  };

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
            title: 'Tổng quan học tập',
          },
        ]}
        className="mb-6"
      />

      {/* Greeting Card */}
      <Card className="mb-6 border-0 shadow-sm rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <Title level={2} className="text-white font-bold m-0">
          Góc học tập của bạn
        </Title>
        <Paragraph className="text-emerald-50 m-0 mt-2 text-base">
          Theo dõi tiến độ, xem kết quả học tập và tham gia các lớp học của thầy cô giao.
        </Paragraph>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12}>
          <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-400 font-semibold text-sm">TỔNG LƯỢT LÀM BÀI</span>}
              value={45}
              precision={0}
              valueStyle={{ color: '#059669', fontWeight: 'bold', fontSize: '2rem' }}
              prefix={<BookOutlined className="text-emerald-500 mr-2" />}
              suffix={<span className="text-gray-400 text-sm ml-2">bài tập</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <Statistic
              title={<span className="text-gray-400 font-semibold text-sm">ĐIỂM TRUNG BÌNH LỚP</span>}
              value={8.5}
              precision={1}
              valueStyle={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '2rem' }}
              prefix={<TrophyOutlined className="text-yellow-500 mr-2" />}
              suffix={<span className="text-gray-400 text-sm ml-2">/ 10</span>}
            />
          </Card>
        </Col>
      </Row>

      {/* Custom SVG Line Chart Card */}
      <Card 
        title={
          <div className="flex items-center gap-2 py-1">
            <BarChartOutlined className="text-emerald-500 text-lg" />
            <span className="font-bold text-gray-700">Tỉ lệ hoàn thành bài tập theo tháng (12 tháng gần nhất)</span>
          </div>
        }
        className="mb-6 border-0 shadow-sm rounded-2xl"
      >
        <div className="relative w-full overflow-x-auto">
          <div style={{ minWidth: '700px', position: 'relative' }}>
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto select-none"
            >
              {/* Định nghĩa gradient đổ bóng dưới dòng kẻ */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Đường kẻ ngang và nhãn trục Y */}
              {yGridTicks.map((tick) => {
                const y = paddingTop + chartHeight * (1 - tick / 100);
                return (
                  <g key={tick}>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={svgWidth - paddingRight} 
                      y2={y} 
                      stroke="#f1f5f9" 
                      strokeWidth={1.5}
                    />
                    <text 
                      x={paddingLeft - 12} 
                      y={y + 4} 
                      fill="#94a3b8" 
                      fontSize={11} 
                      textAnchor="end"
                      className="font-medium"
                    >
                      {tick}%
                    </text>
                  </g>
                );
              })}

              {/* Nhãn trục X */}
              {points.map((p, i) => (
                <text 
                  key={i} 
                  x={p.x} 
                  y={svgHeight - paddingBottom + 24} 
                  fill="#94a3b8" 
                  fontSize={11} 
                  textAnchor="middle"
                  className="font-medium"
                >
                  {p.month}
                </text>
              ))}

              {/* Vùng Area Chart dưới đường thẳng */}
              <path 
                d={areaPath} 
                fill="url(#areaGradient)" 
              />

              {/* Đường Line Chart chính */}
              <path 
                d={linePath} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth={3} 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Các điểm tròn và vòng tròn khi hover */}
              {points.map((p, i) => (
                <g key={i}>
                  {hoveredIndex === i && (
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r={8} 
                      fill="#10b981" 
                      opacity={0.3} 
                    />
                  )}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={4.5} 
                    fill="#ffffff" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                  />
                </g>
              ))}

              {/* Các cột cảm ứng vô hình để dễ bắt sự kiện hover chuột */}
              {points.map((p, i) => {
                const step = chartWidth / (chartData.length - 1);
                const rectX = p.x - step / 2;
                return (
                  <rect
                    key={i}
                    x={rectX}
                    y={paddingTop}
                    width={step}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseMove={(e) => handleMouseMove(e, i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
              })}
            </svg>

            {/* Tooltip render tùy biến theo vị trí hovered */}
            {hoveredIndex !== null && (
              <div 
                className="absolute bg-slate-800 text-white p-2 px-3 rounded-lg shadow-md pointer-events-none transition-all duration-75 text-xs z-10"
                style={{ 
                  left: `${tooltipPos.x}px`, 
                  top: `${tooltipPos.y}px`,
                  transform: 'translate(-50%, -100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <div className="font-semibold">{chartData[hoveredIndex].month}</div>
                <div className="text-emerald-400 font-bold mt-0.5">
                  Tỉ lệ hoàn thành: {chartData[hoveredIndex].value}%
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Tabs Classes */}
      <Card 
        title={
          <div className="flex items-center gap-2 py-1">
            <CheckCircleOutlined className="text-emerald-500 text-lg" />
            <span className="font-bold text-gray-700">Thông tin lớp học</span>
          </div>
        }
        className="border-0 shadow-sm rounded-2xl"
        styles={{ body: { paddingTop: 8 } }}
      >
        <Tabs defaultActiveKey="1" items={tabItems} className="student-home-tabs" />
      </Card>

      <style>{`
        .student-home-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #f1f5f9;
        }
        .student-home-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #059669 !important;
        }
        .student-home-tabs .ant-tabs-ink-bar {
          background: #059669 !important;
        }
      `}</style>
    </div>
  );
};

export default StudentHome;
