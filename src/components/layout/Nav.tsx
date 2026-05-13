import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import './Nav.css';

const Nav: React.FC = () => {
  const [isLoginVisible, setIsLoginVisible] = useState<boolean>(false);

  const showLoginModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoginVisible(true);
  };

  const handleCancel = () => {
    setIsLoginVisible(false);
  };

  return (
    <>
      <nav className="nav-container">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Trang chủ
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/phuong-nam" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Phương Nam
            </NavLink>
          </li>
          <li className="nav-item">
            <a href="#login" className="nav-link" onClick={showLoginModal}>
              Đăng nhập
            </a>
          </li>
          <li className="nav-item">
            <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Đăng ký học sinh
            </NavLink>
          </li>
        </ul>
      </nav>

      <LoginModal visible={isLoginVisible} onCancel={handleCancel} />
    </>
  );
};

export default Nav;
