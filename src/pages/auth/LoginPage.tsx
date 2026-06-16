import React, { useState } from 'react';
import { Form, Input, Button, Typography, Card, App } from 'antd';
import { useNavigate, Navigate } from 'react-router-dom';
import { EyeInvisibleOutlined, EyeTwoTone, PlayCircleFilled } from '@ant-design/icons';
import api from '../../api';
import useAuthStore from '../../store/useAuthStore';
import { ApiResponse, LoginDto, LoginResponse } from '../../types';
import '../../components/auth/LoginModal.css'; // Tái sử dụng CSS của login modal

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { user, token, setAuth } = useAuthStore();

  // Nếu đã đăng nhập rồi thì redirect ngay tới dashboard tương ứng
  if (token && user) {
    const userRole = user.role?.toLowerCase() || '';
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    if (userRole === 'student') return <Navigate to="/student/home" replace />;
  }

  const onFinish = async (values: LoginDto) => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
        email: values.email,
        password: values.password
      });

      if (response.data.success) {
        message.success('Đăng nhập thành công!');
        const { user: loggedUser, accessToken } = response.data.data || {};
        
        if (loggedUser && accessToken) {
          setAuth(loggedUser, accessToken);
          
          setTimeout(() => {
            const userRole = loggedUser.role?.toLowerCase() || '';
            if (userRole === 'admin') {
              navigate('/admin/dashboard', { replace: true });
            } else if (userRole === 'teacher') {
              navigate('/teacher/dashboard', { replace: true });
            } else if (userRole === 'student') {
              navigate('/student/home', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }, 500);
        }
      }
    } catch (error: any) {
      console.error('Login page error:', error);
      if (!error.response) {
        message.error('Không thể kết nối đến Backend. Vui lòng kiểm tra server.');
      } else {
        const errorMsg = error.response.data?.message || 'Đã xảy ra lỗi khi đăng nhập';
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#e6f7ff] p-4">
      <Card 
        className="w-full max-w-[900px] border-0 shadow-lg overflow-hidden" 
        style={{ borderRadius: '16px' }}
        styles={{ body: { padding: 0 } }}
      >
        <div className="login-modal-container" style={{ minHeight: '520px' }}>
          {/* Left Side: Form */}
          <div className="login-form-side" style={{ padding: '40px' }}>
            <div className="form-header">
              <Title level={2} className="login-title">ĐĂNG NHẬP</Title>
            </div>
            
            <Form 
              layout="vertical" 
              className="actual-form"
              onFinish={onFinish}
              initialValues={{
                email: 'testitdn@gmail.com',
                password: 'sachso'
              }}
            >
              <Form.Item
                label={<span className="form-label">Email</span>}
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không đúng định dạng!' }
                ]}
              >
                <Input placeholder="example@email.com" className="login-input" />
              </Form.Item>

              <Form.Item
                label={<span className="form-label">Mật khẩu</span>}
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  placeholder="********"
                  className="login-input"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <div className="forgot-password-link">
                <a href="#forgot">Quên mật khẩu?</a>
              </div>

              <Form.Item>
                <Button 
                  type="primary" 
                  block 
                  className="login-submit-btn h-11 text-base font-semibold"
                  htmlType="submit"
                  loading={loading}
                  style={{ borderRadius: '8px' }}
                >
                  ĐĂNG NHẬP
                </Button>
              </Form.Item>
            </Form>

            <div className="form-footer">
              <Text className="footer-notice text-center text-xs block mt-4">
                Website <a href="http://sachso.edu.vn">http://sachso.edu.vn</a> chuyển sang <a href="https://sachdientu.phuongnam.edu.vn">https://sachdientu.phuongnam.edu.vn</a> Từ ngày 24/10/2025
              </Text>
            </div>
          </div>

          {/* Right Side: Illustration */}
          <div className="login-illustration-side">
            <div className="illustration-wrapper">
              <div className="grad-cap">
                <div className="cap-top"></div>
                <div className="cap-side"></div>
                <div className="tassel"></div>
              </div>

              <div className="doc-frames">
                <div className="doc-frame frame-1"></div>
                <div className="doc-frame frame-2"></div>
              </div>

              <div className="video-player-box">
                <div className="video-screen">
                  <PlayCircleFilled className="play-icon" />
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                    <div className="progress-dot"></div>
                  </div>
                </div>
              </div>

              <div className="books-stack">
                <div className="book book-blue"></div>
                <div className="book book-green"></div>
                <div className="book book-orange">
                   <div className="book-spine"></div>
                </div>
              </div>

              <div className="float-shape shape-circle"></div>
              <div className="float-shape shape-triangle"></div>
              <div className="float-shape shape-square"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
