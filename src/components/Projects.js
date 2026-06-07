import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const projects = [
    {
      title: 'Smartphone Addiction Detection',
      description: 'AI-powered system for analyzing smartphone usage patterns and identifying signs of digital addiction using machine learning techniques.',
      tech: ['Usage behavior analysis', 'Addiction risk prediction', 'Data visualization dashboard', 'Machine learning insights', 'Responsive UI'],
      category: 'Machine Learning',
      github: 'https://github.com/Balasujith2007/smartphone-addition'
    },
    {
      title: 'SaaS Product Platform',
      description: 'Modern SaaS platform featuring authentication, subscription-ready architecture, dashboard management, and scalable application structure.',
      tech: ['Authentication system', 'User dashboard', 'Scalable architecture', 'Responsive design', 'Secure application structure'],
      category: 'Full Stack Development',
      github: 'https://github.com/Balasujith2007/Software-as-a-service'
    },
    {
      title: 'Medicine Reminder System',
      description: 'Smart medicine reminder application helping users track medications, schedules, and dosage reminders effectively.',
      tech: ['Medication scheduling', 'Reminder notifications', 'User-friendly dashboard', 'Progress tracking', 'Responsive UI'],
      category: 'Web Application',
      github: 'https://github.com/Balasujith2007/Software-as-a-service'
    },
    {
      title: 'SRM Smart Student Portal',
      description: 'Comprehensive student management portal designed to streamline academic activities, student records, and campus workflows.',
      tech: ['Student management', 'Academic tracking', 'Dashboard analytics', 'Secure authentication', 'Modern responsive interface'],
      category: 'Web Application',
      github: 'https://github.com/dhyaneshdhyanesh739-ship-it/Smart-Student-Portal'
    }
  ];

  return (
    <section className="projects" id="projects">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">A showcase of my recent work and technical implementations</p>

          <div className="projects-container">
            {projects.map((project, index) => (
              <motion.article
                key={index}
                className="project-item"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="project-number">0{index + 1}</div>
                <div className="project-content">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  <div className="project-footer">
                    <div className="project-tech-list">
                      {project.tech.map((tech, idx) => (
                        <span key={idx} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                      <FaGithub /> View Code
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
