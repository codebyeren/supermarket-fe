import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer" style={{
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}>
      <div className="footer-container">
        {/* Logo & Intro */}
        <div className="footer-section footer-logo">
          <div className="footer-logo-box"><img src="../../logo.png" alt="Logo" style={{ width: 100, height: 50 }} /></div>
          <p className="footer-desc">
            A full-service web design agency in Vietnam. We create beautiful, fast, and secure sites at affordable rates for small businesses and entrepreneurs alike.
          </p>
          <button className="footer-cta">GET A WEBSITE</button>
        </div>
        {/* Web Design Services */}
        <div className="footer-section">
          <h4 className="footer-title">Web Design Services</h4>
          <ul className="footer-list text-start">
            <li>Website Design & Development</li>
            <li>Website Speed Optimization</li>
            <li>Hourly Website Updates</li>
            <li>Non-Profit Web Design</li>
          </ul>
        </div>
        {/* Learn Web Design */}
        <div className="footer-section">
          <h4 className="footer-title">Learn Web Design</h4>
          <ul className="footer-list text-start">
            <li>Best Practices</li>
            <li>Speed Optimization</li>
            <li>Search Engine Optimization</li>
            <li>Web Design</li>
            <li>WordPress</li>
          </ul>
        </div>
        {/* Links */}
        <div className="footer-section">
          <h4 className="footer-title">Links</h4>
          <ul className="footer-list text-start">
            <li className="footer-link-item">
              <span className="footer-link-icon">🔗</span>
              <Link to="/about" className="footer-link">About</Link>
            </li>
            <li className="footer-link-item">
              <span className="footer-link-icon">🔗</span>
              <Link to="/contact" className="footer-link">Contact</Link>
            </li>
          </ul>
        </div>
        
        
      </div>
    </footer>
  );
};

export default Footer; 