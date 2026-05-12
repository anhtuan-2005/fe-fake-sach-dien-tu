import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography, Space, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CloseOutlined, EyeInvisibleOutlined, EyeTwoTone, PlayCircleFilled } from '@ant-design/icons';
import api from '../../api';
import useAuthStore from '../../store/useAuthStore';
import './LoginModal.css';

const { Title, Text } = Typography;

const LoginModal = ({ visible, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onFinish = async (values) => {
    setLoading(true);
    console.log('Đang gọi API tại:', api.defaults.baseURL + '/auth/login');
    try {
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password
      });

      if (response.data.success) {
        message.success('Đăng nhập thành công!');
        // Cập nhật Zustand Store (Persist sẽ tự lưu accessToken vào localStorage)
        // Refresh Token được backend trả về qua HttpOnly Cookie
        setAuth(response.data.user, response.data.accessToken);
        
        // Đóng modal
        onCancel();
        
        // Điều hướng thông minh theo role
        setTimeout(() => {
          if (response.data.user.role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (!error.response) {
        // Lỗi không kết nối được server (ERR_CONNECTION_REFUSED, v.v.)
        message.error('Không thể kết nối đến Backend. Vui lòng kiểm tra xem server Node.js đã chạy chưa');
      } else {
        // Lỗi từ phía server trả về (401, 404, 500, v.v.)
        const errorMsg = error.response.data?.message || 'Đã xảy ra lỗi khi đăng nhập';
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      closeIcon={<CloseOutlined className="modal-close-icon" />}
      width={900}
      centered
      className="login-modal-custom"
      styles={{ body: { padding: 0 } }}
    >
      <div className="login-modal-container">
        {/* Left Side: Form */}
        <div className="login-form-side">
          <div className="form-header">
            <Title level={2} className="login-title">ĐĂNG NHẬP</Title>
          </div>
          
          <Form 
            layout="vertical" 
            className="actual-form"
            onFinish={onFinish}
            initialValues={{
              email: 'testitdn@gmail.com', // Điền sẵn theo yêu cầu để test
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
                className="login-submit-btn"
                htmlType="submit"
                loading={loading}
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </Form>

          <div className="form-footer">
            <Text className="footer-notice">
              Website <a href="http://sachso.edu.vn">http://sachso.edu.vn</a> chuyển sang <a href="https://sachdientu.phuongnam.edu.vn">https://sachdientu.phuongnam.edu.vn</a> Từ ngày 24/10/2025
            </Text>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="login-illustration-side">
          <div className="illustration-wrapper">
            {/* Graduation Cap */}
            <div className="grad-cap">
              <div className="cap-top"></div>
              <div className="cap-side"></div>
              <div className="tassel"></div>
            </div>

            {/* Document Frames */}
            <div className="doc-frames">
              <div className="doc-frame frame-1"></div>
              <div className="doc-frame frame-2"></div>
            </div>

            {/* Video Player Box */}
            <div className="video-player-box">
              <div className="video-screen">
                <PlayCircleFilled className="play-icon" />
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                  <div className="progress-dot"></div>
                </div>
              </div>
            </div>

            {/* Books Stack */}
            <div className="books-stack">
              <div className="book book-blue"></div>
              <div className="book book-green"></div>
              <div className="book book-orange">
                 <div className="book-spine"></div>
              </div>
            </div>

            {/* Floating Shapes */}
            <div className="float-shape shape-circle"></div>
            <div className="float-shape shape-triangle"></div>
            <div className="float-shape shape-square"></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
