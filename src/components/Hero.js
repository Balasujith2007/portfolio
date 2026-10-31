import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import './Hero.css';

const Hero = () => {
  const { data } = usePortfolio();
  const about = data.about || {};
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const roles = useMemo(() => {
    return about.roles && about.roles.length > 0 ? about.roles : [
      'AI & Data Science Engineer',
      'Full Stack Developer',
      'Competitive Programmer',
      'Problem Solver'
    ];
  }, [about.roles]);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, roles]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-background">
        <div className="grid-pattern"></div>
      </div>
      
      <motion.div 
        className="hero-content container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-layout">
          <div className="hero-text-section">
            <motion.div className="hero-tag" variants={itemVariants}>
              <span>{about.welcomeTag || 'Welcome to my portfolio'}</span>
            </motion.div>

            <motion.h1 variants={itemVariants}>
              Hi, I'm <span className="name-highlight">{about.name || 'Balasujith S'}</span>
            </motion.h1>

            <motion.div className="typing-wrapper" variants={itemVariants}>
              <span className="typing-text">{text}</span>
              <span className="cursor">|</span>
            </motion.div>

            <motion.p className="hero-description" variants={itemVariants}>
              {about.heroDescription ||
                'Passionate Full Stack Developer dedicated to crafting modern digital experiences through clean code, innovative thinking, and continuous learning.'}
            </motion.p>

            <motion.div className="hero-buttons" variants={itemVariants}>
              <a href="#projects" className="btn btn-secondary">
                View My Work
              </a>
              <a 
                href={about.resumeUrl || '/Balasujith_Resume.pdf'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
              >
                View Resume
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
            </motion.div>

            <motion.div className="hero-social" variants={itemVariants}>
              {about.github && (
                <a href={about.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FaGithub />
                </a>
              )}
              {about.linkedin && (
                <a href={about.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              )}
              {about.email && (
                <a href={`mailto:${about.email}`} aria-label="Email">
                  <FaEnvelope />
                </a>
              )}
              {about.phone && (
                <a href={`tel:${about.phone}`} aria-label="Phone">
                  <FaPhone />
                </a>
              )}
            </motion.div>
          </div>

          <motion.div 
            className="hero-image-section"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="hero-image-container">
              <img 
                src={about.profileImage || '/profile.jpeg'} 
                alt={`${about.name || 'Balasujith S'} - ${about.headline || 'Portfolio'}`} 
                className="hero-profile-image"
              />
              <div className="hero-image-border"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="mouse"></div>
        <span>Scroll Down</span>
      </motion.div>
    </section>
  );
};

export default Hero;
