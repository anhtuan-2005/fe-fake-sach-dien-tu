import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Hero from './components/home/Hero';
import Features from './components/home/Features';
import LearningPyramid from './components/home/LearningPyramid';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ClassManagement from './pages/admin/ClassManagement';
import ClassDetail from './pages/admin/ClassDetail';
import AdminStudentClass from './pages/admin/AdminStudentClass';
import AdminLayout from './pages/admin/AdminLayout';
import ActivityLogs from './pages/admin/ActivityLogs';
import AdminProfile from './pages/admin/profile/AdminProfile';
import QuestionTable from './pages/admin/question-bank/QuestionTable';
import TypeConfigIndex from './pages/type-configs/TypeConfigIndex';

// Teacher Pages
import TeacherLayout from './pages/teacher/TeacherLayout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherClasses from './pages/teacher/classes/TeacherClasses';
import TeacherClassDetail from './pages/teacher/classes/TeacherClassDetail';
import TeacherQuestionBank from './pages/teacher/question-bank/TeacherQuestionBank';
import TeacherProfile from './pages/teacher/profile/TeacherProfile';

// Student Pages
import StudentLayout from './pages/student/StudentLayout';
import StudentHome from './pages/student/home/StudentHome';
import StudentClasses from './pages/student/classes/StudentClasses';
import StudentClassDetail from './pages/student/classes/StudentClassDetail'; // Chi tiết lớp học cho học sinh
import StudentBooks from './pages/student/StudentBooks';
import StudentExercises from './pages/student/StudentExercises';
import StudentProfile from './pages/student/profile/StudentProfile';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
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
        {/* Phân hệ ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="classes/:id" element={<ClassDetail />} />
          <Route path="student-classes" element={<AdminStudentClass />} />
          <Route path="student-classes/:id" element={<ClassDetail isReadOnly={true} />} />
          <Route path="logs" element={<ActivityLogs />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="question-bank" element={<QuestionTable />} />
          <Route path="type-configs" element={<TypeConfigIndex />} />
          <Route path="type configs" element={<TypeConfigIndex />} />
        </Route>

        {/* Phân hệ GIÁO VIÊN */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="classes/:id" element={<TeacherClassDetail />} />
          <Route path="question-bank" element={<TeacherQuestionBank />} />
          <Route path="type-configs" element={<TypeConfigIndex />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Phân hệ HỌC SINH */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentHome />} />
          <Route path="home" element={<StudentHome />} />
          <Route path="classes" element={<StudentClasses />} />
          <Route path="classes/:id" element={<StudentClassDetail />} />
          <Route path="books" element={<StudentBooks />} />
          <Route path="exercises" element={<StudentExercises />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/phuong-nam" element={<PhuongNam />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
