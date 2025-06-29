import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & Intro */}
        <div className="footer-section footer-logo">
          <div className="footer-logo-box">Logo</div>
          <p className="footer-desc">
            A full-service web design agency in Vietnam. We create beautiful, fast, and secure sites at affordable rates for small businesses and entrepreneurs alike.
          </p>
          <button className="footer-cta">GET A WEBSITE</button>
        </div>
        {/* Web Design Services */}
        <div className="footer-section">
          <h4 className="footer-title">Web Design Services</h4>
          <ul className="footer-list">
            <li>Website Design & Development</li>
            <li>Website Speed Optimization</li>
            <li>Hourly Website Updates,</li>
            <li>Non-Profit Web Design</li>
          </ul>
        </div>
        {/* Learn Web Design */}
        <div className="footer-section">
          <h4 className="footer-title">Learn Web Design</h4>
          <ul className="footer-list">
            <li>Best Practices</li>
            <li>Speed Optimization</li>
            <li>Search Engine Optimization</li>
            <li>Web Design</li>
            <li>WordPress</li>
          </ul>
        </div>
        {/* Contact Me */}
        <div className="footer-section">
          <h4 className="footer-title">Contact Me</h4>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <span className="footer-icon">📧</span>
              <span>email.com</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-icon">📍</span>
              <span>Lê Thanh Nghị, Hải Dương</span>
            </div>
            <div className="footer-contact-social">
              <span>Social</span>
              <div className="footer-social-icons">
                <span className="footer-social-icon">—</span>
                <span className="footer-social-icon">—</span>
              </div>
              <div className="footer-social-btns">
                <a href="#" className="footer-social-btn" aria-label="Twitter"><i className="fa fa-twitter"></i></a>
                <a href="#" className="footer-social-btn" aria-label="Facebook"><i className="fa fa-facebook"></i></a>
                <a href="#" className="footer-social-btn" aria-label="YouTube"><i className="fa fa-youtube"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 