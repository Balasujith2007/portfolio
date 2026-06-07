import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Skills.css';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const skillSections = [
    {
      title: 'Programming',
      icon: '{ }',
      skills: ['Python', 'Java', 'C++', 'C']
    },
    {
      title: 'Web',
      icon: '< />',
      skills: ['HTML', 'CSS', 'JavaScript', 'MERN Stack']
    },
    {
      title: 'Database',
      icon: '⚡',
      skills: ['DBMS', 'MySQL']
    },
    {
      title: 'Tools',
      icon: '🛠',
      skills: ['n8n', 'UI/UX Design', 'Figma', 'Stitch']
    }
  ];

  return (
    <section className="skills" id="skills">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Technical Expertise</h2>
          <p className="section-subtitle">Technologies and tools I work with</p>

          <div className="skills-wrapper">
            {skillSections.map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                className="skill-section"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
              >
                <div className="skill-section-header">
                  <span className="skill-icon">{section.icon}</span>
                  <h3>{section.title}</h3>
                </div>
                <div className="skill-items">
                  {section.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skillIndex}
                      className="skill-chip"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ 
                        delay: sectionIndex * 0.1 + skillIndex * 0.05, 
                        duration: 0.3 
                      }}
                      whileHover={{ scale: 1.08, y: -3 }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
