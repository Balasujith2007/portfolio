import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaTrophy, FaStar, FaMedal, FaCode, FaFlag, 
  FaAward, FaExternalLinkAlt, FaCertificate, FaCheckCircle 
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import AnimatedStatCounter from './AnimatedStatCounter';
import './Accomplishments.css';

const Accomplishments = () => {
  const { data } = usePortfolio();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  // Determines whether this specific statistic should animate
  const isAnimatedStat = (item) => {
    const title = (item.title || '').toLowerCase();
    return (
      title.includes('contest rating') ||
      title.includes('problems solved') ||
      title.includes('global contest')
    );
  };

  // Accomplishments data with resilient fallbacks
  const accomplishments = data.accomplishments && data.accomplishments.length > 0 
    ? data.accomplishments 
    : [
        {
          id: 'acc-1',
          metric: 'Division 3',
          title: 'CodeChef Ranking',
          description: 'Active competitive programming ranking achieved through division contests.',
          icon: 'trophy'
        },
        {
          id: 'acc-2',
          metric: '1400+',
          title: 'Contest Rating',
          description: 'Peak competitive programming contest rating across CodeChef & LeetCode.',
          icon: 'star'
        },
        {
          id: 'acc-3',
          metric: 'Top 15',
          title: 'Academic Rank',
          description: 'Ranked among top performers out of 400+ department peers in B.Tech AI & DS.',
          icon: 'medal'
        },
        {
          id: 'acc-4',
          metric: '1000+',
          title: 'Problems Solved',
          description: 'Data structures and algorithm challenges solved across multiple coding platforms.',
          icon: 'code'
        },
        {
          id: 'acc-5',
          metric: '80+',
          title: 'Global Contests',
          description: 'Participated in global competitive rounds and technical hackathons.',
          icon: 'flag'
        }
      ];

  // Certifications data with resilient fallbacks
  const certifications = data.certifications && data.certifications.length > 0 
    ? data.certifications 
    : [
        {
          id: 'cert-1',
          name: 'Operating System Foundations',
          issuer: 'CISCO',
          year: '2023',
          link: 'https://www.netacad.com/',
          icon: '🐧'
        },
        {
          id: 'cert-2',
          name: 'Cyber Security Essentials',
          issuer: 'CISCO',
          year: '2023',
          link: 'https://www.netacad.com/',
          icon: '🛡️'
        },
        {
          id: 'cert-3',
          name: 'Career Management Essentials',
          issuer: 'IBM SkillsBuild',
          year: '2024',
          link: 'https://skillsbuild.org/',
          icon: '💼'
        },
        {
          id: 'cert-4',
          name: 'Artificial Intelligence Essentials',
          issuer: 'Coursera',
          year: '2024',
          link: 'https://www.coursera.org/',
          icon: '🧠'
        },
        {
          id: 'cert-5',
          name: 'Networking Essentials',
          issuer: 'CISCO',
          year: '2023',
          link: 'https://www.netacad.com/',
          icon: '🌐'
        },
        {
          id: 'cert-6',
          name: 'Introduction to Data Science',
          issuer: 'Cisco Networking Academy',
          year: '2023',
          link: 'https://www.netacad.com/',
          icon: '📊'
        }
      ];

  // Icon resolver for accomplishment cards
  const renderAccomplishmentIcon = (iconName) => {
    switch (iconName) {
      case 'trophy': return <FaTrophy />;
      case 'star': return <FaStar />;
      case 'medal': return <FaMedal />;
      case 'code': return <FaCode />;
      case 'flag': return <FaFlag />;
      default: return <FaAward />;
    }
  };

  return (
    <section className="accomplishments" id="accomplishments">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Heading with Navy Underline */}
          <div className="accomplishments-header-box">
            <h2 className="section-title">Accomplishments</h2>
            <p className="section-subtitle">
              Milestones, competitive programming ranks, ratings, and verified coursework
            </p>
          </div>

          {/* 1. ACCOMPLISHMENTS CARDS GRID (Reference 2 Layout) */}
          <div className="accomplishments-cards-grid">
            {accomplishments.map((item, index) => (
              <motion.div
                key={item.id || index}
                className="accomplishment-premium-card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
              >
                <div className="card-top-icon-row">
                  <div className="accomplishment-icon-badge">
                    {renderAccomplishmentIcon(item.icon)}
                  </div>
                </div>

                <div className="accomplishment-metric">
                  {isAnimatedStat(item) ? (
                    <AnimatedStatCounter value={item.metric} inView={inView} duration={1800} />
                  ) : (
                    item.metric
                  )}
                </div>

                <h3 className="accomplishment-title">
                  {item.title}
                </h3>

                <p className="accomplishment-description">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* 2. CERTIFICATIONS CONTAINER WITH NAVY HEADER (Reference 1 Layout) */}
          <motion.div 
            className="certifications-container-card"
            initial={{ opacity: 0, y: 35 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Full-width Navy Header */}
            <div className="certifications-navy-header">
              <div className="header-title-group">
                <FaCertificate className="header-cert-icon" />
                <div>
                  <h3 className="certifications-heading">Certifications</h3>
                  <span className="certifications-subhead">
                    Verified technical certifications & industry credentials
                  </span>
                </div>
              </div>
              <div className="cert-count-pill">
                {certifications.length} Credentials
              </div>
            </div>

            {/* Certifications Cards Grid */}
            <div className="certifications-cards-grid">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id || index}
                  className="cert-premium-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.45 + index * 0.08, duration: 0.4 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="cert-card-top">
                    <span className="cert-issuer-badge">
                      <span className="issuer-dot"></span>
                      {cert.issuer}
                    </span>
                    {cert.year && (
                      <span className="cert-year-badge">
                        {cert.year}
                      </span>
                    )}
                  </div>

                  <div className="cert-card-body">
                    <div className="cert-card-icon-title">
                      {cert.icon && (
                        <span className="cert-card-emoji-icon">{cert.icon}</span>
                      )}
                      <h4 className="cert-title">{cert.name}</h4>
                    </div>
                  </div>

                  <div className="cert-card-footer">
                    {cert.link && cert.link !== '#' ? (
                      <a 
                        href={cert.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="verify-credential-btn"
                        aria-label={`Verify credential for ${cert.name}`}
                      >
                        Verify Credential <FaExternalLinkAlt className="btn-ext-icon" />
                      </a>
                    ) : (
                      <span className="credential-verified-tag">
                        <FaCheckCircle className="verified-icon" /> Verified Credential
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 3. ELEGANT DECLARATION CARD */}
          <motion.div
            className="portfolio-declaration-card"
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="declaration-content">
              <FaCheckCircle className="declaration-badge-icon" />
              <div>
                <h4>Declaration of Authenticity</h4>
                <p>
                  I hereby declare that all academic scores, certifications, ratings, and project achievements detailed in this portfolio are accurate and verifiable.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Accomplishments;
