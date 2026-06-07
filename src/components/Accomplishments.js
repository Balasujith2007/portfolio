import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Accomplishments.css';

const Accomplishments = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const achievements = [
    {
      title: 'Division 3 Ranking',
      description: 'Achieved on CodeChef',
      metric: 'Div 3'
    },
    {
      title: '1400+ Rating',
      description: 'Secured on CodeChef and LeetCode',
      metric: '1400+'
    },
    {
      title: '1000+ Problems',
      description: 'Solved across rated coding platforms',
      metric: '1000+'
    },
    {
      title: '80+ Contests',
      description: 'Participated in global competitive programming contests',
      metric: '80+'
    }
  ];

  const certifications = [
    { name: 'Operating System Foundations', issuer: 'CISCO' },
    { name: 'Cyber security', issuer: 'CISCO' },
    { name: 'Career Management Essentials', issuer: 'IBM SkillsBuild' },
    { name: 'Artificial intelligence Essenntials', issuer: 'Coursera' }
  ];

  return (
    <section className="accomplishments" id="accomplishments">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Accomplishments</h2>

          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="achievement-card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <div className="achievement-metric">{achievement.metric}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="certifications-section"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="certifications-header">
              <h3>Certifications</h3>
            </div>
            <div className="certifications-grid">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  className="cert-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="cert-content">
                    <h4>{cert.name}</h4>
                    <p>{cert.issuer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            className="declaration-section"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
            style={{ marginTop: '4rem', textAlign: 'center', fontStyle: 'italic' }}
          >
            <h3>Declaration</h3>
            <p>I hereby declare that the information provided in this resume is true and accurate to the best of my knowledge.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Accomplishments;
