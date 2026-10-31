import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePortfolio } from '../context/PortfolioContext';
import AnimatedStatCounter from './AnimatedStatCounter';
import './About.css';

const About = () => {
  const { data } = usePortfolio();
  const about = data.about || {};
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15
  });

  const stats = about.stats && about.stats.length > 0 ? about.stats : [
    { value: '1000+', label: 'Problems Solved' },
    { value: '80+', label: 'Contests Participated' },
    { value: '8.00', label: 'CGPA' },
    { value: '4+', label: 'Projects Completed' }
  ];

  const education = about.education || {
    degree: 'B.Tech – Artificial Intelligence and Data Science',
    institution: 'KIT - KalaignarKarunanidhi Institute of Technology, Coimbatore',
    cgpa: '8.00',
    expected: '01/2028'
  };

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
                  {about.objectivesLead ||
                    'Detail-oriented B.Tech graduate specializing in AI and Data Science with expertise in Python, C, C++, data structures, web development, and machine learning.'}
                </p>
                
                <p>
                  {about.objectivesSecondary ||
                    'Seeking opportunities to apply analytical and technical skills in building efficient and data-driven solutions.'}
                </p>

                <div className="stats-container">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.id || index}
                      className="stat-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <h3>
                        <AnimatedStatCounter value={stat.value} inView={inView} />
                      </h3>
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
                <h4>{education.degree || 'B.Tech – Artificial Intelligence and Data Science'}</h4>
                <p className="institution">{education.institution || 'KIT - KalaignarKarunanidhi Institute of Technology, Coimbatore'}</p>
                <div className="education-details">
                  <span className="detail-item">
                    <strong>CGPA:</strong> {education.cgpa || '8.00'}
                  </span>
                  <span className="detail-item">
                    <strong>Expected in:</strong> {education.expected || '01/2028'}
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
