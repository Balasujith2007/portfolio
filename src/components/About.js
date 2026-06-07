import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const stats = [
    { value: '1000+', label: 'Problems Solved' },
    { value: '80+', label: 'Contests Participated' },
    { value: '8.00', label: 'CGPA' },
    { value: '4+', label: 'Projects Completed' }
  ];

  return (
    <section className="about" id="about">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>

          <div className="about-wrapper">
            <div className="about-main">
              <div className="about-intro">
                <h3>Objectives</h3>
                <p className="lead">
                  Detail-oriented B.Tech graduate specializing in AI and Data Science with expertise in Python, C, C++, data structures, web development, and machine learning.
                </p>
                
                <p>
                  Seeking opportunities to apply analytical and technical skills in building efficient and data-driven solutions.
                </p>

                <div className="stats-container">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="stat-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <h3>{stat.value}</h3>
                      <p>{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="education-section">
              <div className="education-header">
                <h3>Education</h3>
              </div>
              <div className="education-content">
                <h4>B.Tech – Artificial Intelligence and Data Science</h4>
                <p className="institution">KIT - KalaignarKarunanidhi Institute of Technology, Coimbatore</p>
                <div className="education-details">
                  <span className="detail-item">
                    <strong>CGPA:</strong> 8.00
                  </span>
                  <span className="detail-item">
                    <strong>Expected in:</strong> 01/2028
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
