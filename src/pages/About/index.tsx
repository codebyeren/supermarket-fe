import React from 'react';
import './About.css';
import { FaBullseye, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { LuEye } from 'react-icons/lu';
import { MdLightbulbOutline, MdHandshake, MdGroups } from 'react-icons/md'; 

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Content */}
      <section className="about-hero">
        <h1>About Us</h1>
        <p>We are a group of passionate individuals...</p>
        <p>We believe that every product and service...</p>
      </section>

      <section className="about-section triple-grid">
        <div className="info-block">
          <h2><FaBullseye style={{ color: '#00a651', marginRight: '6px' }} />Mission</h2>
          <p>Our mission is to deliver optimal technology solutions...</p>
        </div>
        <div className="info-block">
          <h2><LuEye style={{ color: '#00a651', marginRight: '6px' }} />Vision</h2>
          <p>Our vision is to become the leading e-commerce platform...</p>
        </div>
        <div className="info-block">
          <h2><MdLightbulbOutline style={{ color: '#00a651', marginRight: '6px' }} />Core Values</h2>
          <ul>
            <li><MdLightbulbOutline style={{ color: '#00a651' }} /> <strong>Innovation:</strong> Creative solutions.</li>
            <li><MdHandshake style={{ color: '#00a651' }} /> <strong>Transparency:</strong> Honesty and accountability.</li>
            <li><MdGroups style={{ color: '#00a651' }} /> <strong>User-Centricity:</strong> User-first mindset.</li>
          </ul>
        </div>
      </section>

      <section className="about-section about-history">
        <h2>Our History</h2>
        <p>Founded in 2015, our supermarket started as a small store...</p>
      </section>
    </div>
  );
};

export default About;
