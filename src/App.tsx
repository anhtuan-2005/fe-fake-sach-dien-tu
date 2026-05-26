import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import LearningPyramid from './components/home/LearningPyramid';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClassManagement from './pages/admin/ClassManagement';
import ClassDetail from './pages/admin/ClassDetail';
import AdminStudentClass from './pages/admin/AdminStudentClass';
import AdminLayout from './pages/admin/AdminLayout';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdminProfile from './pages/admin/profile/AdminProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

const Home: React.FC = () => (
  <div className="home-page">
    <Hero />
    <Features />
    <LearningPyramid />
  </div>
);

const PhuongNam: React.FC = () => (
  <div className="page-content">
    <h2>Phương Nam</h2>
    <p>Khám phá kho tàng tri thức từ nhà xuất bản Phương Nam.</p>
  </div>
);

const Login: React.FC = () => (
  <div className="page-content">
    <h2>Đăng nhập</h2>
    <p>Vui lòng đăng nhập để tiếp tục học tập.</p>
  </div>
);

const Register: React.FC = () => (
  <div className="page-content">
    <h2>Đăng ký học sinh</h2>
    <p>Tham gia cộng đồng học tập của chúng tôi ngay hôm nay!</p>
  </div>
);

const ClientLayout: React.FC = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="classes/:id" element={<ClassDetail />} />
          <Route path="student-classes" element={<AdminStudentClass />} />
          <Route path="student-classes/:id" element={<ClassDetail isReadOnly={true} />} />
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/phuong-nam" element={<PhuongNam />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
