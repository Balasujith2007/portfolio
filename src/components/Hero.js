import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const roles = [
      'AI & Data Science Engineer',
      'Full Stack Developer',
      'Competitive Programmer',
      'Problem Solver'
    ];

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
  }, [text, isDeleting, loopNum, typingSpeed]);

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
              <span>Welcome to my portfolio</span>
            </motion.div>

            <motion.h1 variants={itemVariants}>
              Hi, I'm <span className="name-highlight">Balasujith S</span>
            </motion.h1>

            <motion.div className="typing-wrapper" variants={itemVariants}>
              <span className="typing-text">{text}</span>
              <span className="cursor">|</span>
            </motion.div>

            <motion.p className="hero-description" variants={itemVariants}>
              Passionate Full Stack Developer dedicated to crafting modern digital experiences through clean code, innovative thinking, and continuous learning. I specialize in building scalable web applications, exploring emerging technologies, and delivering solutions that combine functionality, performance, and exceptional user experience. My goal is to leverage technology to solve real-world challenges and create meaningful impact.
            </motion.p>

            <motion.div className="hero-buttons" variants={itemVariants}>
              <a href="#projects" className="btn btn-secondary">
                View My Work
              </a>
              <a href="/Balasujith-Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                View Resume
              </a>
              <a href="#contact" className="btn btn-secondary">
                Get In Touch
              </a>
            </motion.div>

            <motion.div className="hero-social" variants={itemVariants}>
              <a href="https://github.com/BalasujithGowri-11" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/bala-sujith-91a241335/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="mailto:kit28.24bad026@gmail.com">
                <FaEnvelope />
              </a>
              <a href="tel:+917358095641">
                <FaPhone />
              </a>
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
                src="/profile.jpeg" 
                alt="Balasujith S - AI & Data Science Engineer" 
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
