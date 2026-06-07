import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>
              <span className="logo-bracket">{'<'}</span>
              BS
              <span className="logo-bracket">{'/>'}</span>
            </h3>
            <p>Building innovative solutions with code</p>
          </div>

          <div className="footer-links">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Connect</h4>
              <div className="footer-social">
                <a 
                  href="https://github.com/BalasujithGowri-11" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <FaGithub />
                </a>
                <a 
                  href="https://www.linkedin.com/in/bala-sujith-91a241335/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin />
                </a>
                <a 
                  href="mailto:kit28.24bad026@gmail.com"
                  aria-label="Email"
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 Balasujith S. Crafted with <FaHeart className="heart-icon" /> and React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
