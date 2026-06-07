import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Experience.css';

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const experiences = [
    {
      title: 'Freelance Developer',
      duration: '2–3 Months',
      type: 'Freelance',
      responsibilities: [
        '2–3 months of freelance experience in software and application development',
        'Successfully completed 2–3 client projects with customized solutions',
        'Worked on coding, debugging, and project optimization based on client requirements',
        'Delivered high-quality solutions meeting client specifications and deadlines'
      ]
    },
    {
      title: 'Software Development Intern',
      company: 'Arumexa',
      duration: 'Internship Period',
      type: 'Internship',
      responsibilities: [
        'Developed and optimized basic applications using Python and C++',
        'Focused on problem-solving and efficient code implementation',
        'Worked on debugging, testing, and improving program performance',
        'Collaborated on mini-projects and coding tasks',
        'Gained hands-on experience in OOP, data structures, and logical thinking'
      ]
    }
  ];

  return (
    <section className="experience" id="experience">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Professional Experience</h2>

          <div className="experience-grid">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="experience-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <div className="experience-header">
                  <div className="experience-title-section">
                    <h3>{exp.title}</h3>
                    {exp.company && <span className="experience-company">{exp.company}</span>}
                    <span className="experience-type">{exp.type}</span>
                  </div>
                  <span className="experience-duration">{exp.duration}</span>
                </div>
                <ul className="experience-responsibilities">
                  {exp.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
