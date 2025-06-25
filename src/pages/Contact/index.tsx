import React from 'react';
import './Contact.css';
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaClock,
  FaHeadset,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
} from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div className="contact-page">
    
      {/* Main Contact Section */}
      <section className="contact-section">
        <h2>Contact us</h2>
        <div className="triple-grid contact-grid">
          {/* Left - Form */}
          <div className="info-block contact-form">
            <h3><FaHeadset /> Or Send Us a Message</h3>
            <form>
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
              <input type="text" placeholder="Subject" />
              <textarea placeholder="Message" rows={4} />
              <button type="submit">Submit</button>
            </form>
          </div>

          {/* Right - Contact Info */}
          <div className="info-block contact-info">
            <div className="info-item">
              <FaPhoneAlt className="icon" />
              <div className="text-block">
                <strong>Hotline</strong>
                <p>(+84) 909 999 999</p>
                <p>(Mon – Fri, 8:00 AM – 5:00 PM)</p>
              </div>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="icon" />
              <div className="text-block">
                <strong>Address</strong>
                <p>19 Lê Thanh Nghị, Hà Nội</p>
              </div>
            </div>
            <div className="info-item">
              <FaEnvelope className="icon" />
              <div className="text-block">
                <strong>Email</strong>
                <p>support@example.com</p>
                <p className="multiline">For inquiries, feedback, or partnership opportunities.</p>
              </div>
            </div>
            <div className="info-item">
              <FaClock className="icon" />
              <div className="text-block">
                <strong>Working Hours</strong>
                <p>Monday to Friday: 8:00 AM – 5:00 PM</p>
                <p>Saturday & Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="contact-map" style={{ marginBottom: 0 }}>
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=19%20Lê%20Thanh%20Nghị,%20Hà%20Nội&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
};

export default Contact;
