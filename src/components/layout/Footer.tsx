import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="publisher-logo-section">
            <div className="nxb-logo-placeholder">NXBGD</div>
            <div className="nxb-text-group">
               <div className="nxb-name">NHÀ XUẤT BẢN GIÁO DỤC VIỆT NAM</div>
               <div className="nxb-subname">CTCP ĐẦU TƯ & PTGD PHƯƠNG NAM</div>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span>231 Nguyễn Văn Cừ - Phường Chợ Quán - TP.HCM</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span>(028) 73 035 556</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕒</span>
            <span>Thời gian làm việc (08:00 - 17:00)</span>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-brand">
            <div className="mini-logo">
               <div className="shape shape-blue"></div>
               <div className="shape shape-orange"></div>
               <div className="shape shape-green"></div>
            </div>
            <span className="brand-name">Sách Điện Tử</span>
          </div>
          <p className="copyright-text">© 2026 Sách điện tử</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
