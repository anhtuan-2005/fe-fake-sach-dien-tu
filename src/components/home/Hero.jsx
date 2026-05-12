import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-image-wrapper">
          <img 
            src="https://img.freepik.com/free-vector/kids-reading-concept-illustration_114360-8457.jpg" 
            alt="Children learning" 
            className="main-hero-image" 
          />
          {/* Decorative Shapes */}
          <div className="decor-shape shape-1"></div>
          <div className="decor-shape shape-2"></div>
          <div className="decor-shape shape-3"></div>
          <div className="decor-shape shape-4"></div>
          <div className="decor-shape shape-5"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">SÁCH GIÁO KHOA TIẾNG ANH</h1>
          <p className="hero-description">
            Áp dụng phương pháp học tập khoa học mới hệ thống học trực tuyến thông minh, 
            ứng dụng công nghệ 4.0 với trí tuệ nhân tạo. Việc áp dụng phương pháp mới này 
            không những mang lại hiệu quả cao, tiết kiệm thời gian mà còn mang đến tính sáng tạo, 
            tư duy độc lập, sự tìm tòi, nghiên cứu của học sinh.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
