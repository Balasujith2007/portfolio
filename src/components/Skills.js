import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaChevronLeft, FaChevronRight, FaCode, FaLaptopCode, 
  FaDatabase, FaTools, FaLayerGroup, FaThLarge, FaSlidersH 
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import './Skills.css';

const Skills = () => {
  const { data } = usePortfolio();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const skillSections = data.skills && data.skills.length > 0 ? data.skills : [
    {
      id: 'sec-1',
      title: 'Programming',
      icon: '{ }',
      category: 'Programming Languages',
      skills: ['Python', 'Java', 'C++', 'C']
    },
    {
      id: 'sec-2',
      title: 'Web',
      icon: '< />',
      category: 'Frontend & Full Stack',
      skills: ['HTML', 'CSS', 'JavaScript', 'MERN Stack']
    },
    {
      id: 'sec-3',
      title: 'Database',
      icon: '⚡',
      category: 'Database Systems',
      skills: ['DBMS', 'MySQL']
    },
    {
      id: 'sec-4',
      title: 'Tools',
      icon: '🛠',
      category: 'Tools & Platforms',
      skills: ['n8n', 'UI/UX Design', 'Figma', 'Stitch']
    }
  ];

  // Carousel & view state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'carousel'
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Detect screen size for responsive presentation
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode('carousel');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = skillSections.length;

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  // Icon resolver helper for visual richness
  const getCategoryIcon = (section) => {
    const titleLower = (section.title || '').toLowerCase();
    if (titleLower.includes('prog')) return <FaCode />;
    if (titleLower.includes('web')) return <FaLaptopCode />;
    if (titleLower.includes('data')) return <FaDatabase />;
    if (titleLower.includes('tool')) return <FaTools />;
    return section.icon ? <span>{section.icon}</span> : <FaLayerGroup />;
  };

  // Slide animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 }
      }
    })
  };

  return (
    <section className="skills" id="skills" onKeyDown={handleKeyDown}>
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Technical Expertise</h2>
              <p className="section-subtitle">Technologies, frameworks, and tools I leverage to build solutions</p>
            </div>

            {/* Desktop View Mode Toggle (Grid vs Sliding Carousel) */}
            {!isMobile && total > 1 && (
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid Layout"
                  aria-label="Grid view"
                >
                  <FaThLarge /> <span>Grid</span>
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                  onClick={() => setViewMode('carousel')}
                  title="Sliding Carousel Layout"
                  aria-label="Carousel view"
                >
                  <FaSlidersH /> <span>Sliding View</span>
                </button>
              </div>
            )}
          </div>

          {/* Category Tabs Indicator (works as quick jump buttons in carousel view) */}
          <div className="skills-category-tabs">
            {skillSections.map((section, idx) => (
              <button
                key={section.id || idx}
                type="button"
                className={`category-tab-pill ${viewMode === 'carousel' && currentIndex === idx ? 'active' : ''}`}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                  if (viewMode !== 'carousel' && isMobile) setViewMode('carousel');
                }}
              >
                <span className="tab-pill-icon">{getCategoryIcon(section)}</span>
                <span className="tab-pill-title">{section.title}</span>
                <span className="tab-pill-count">{section.skills?.length || 0}</span>
              </button>
            ))}
          </div>

          {/* 1. SLIDING CAROUSEL PRESENTATION */}
          {viewMode === 'carousel' ? (
            <div 
              className="skills-carousel-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="skills-carousel-controls">
                <button
                  type="button"
                  className="carousel-nav-btn prev"
                  onClick={prevSlide}
                  aria-label="Previous skill category"
                >
                  <FaChevronLeft />
                </button>
                <div className="carousel-status-pill">
                  <span>Category {currentIndex + 1} of {total}</span>
                </div>
                <button
                  type="button"
                  className="carousel-nav-btn next"
                  onClick={nextSlide}
                  aria-label="Next skill category"
                >
                  <FaChevronRight />
                </button>
              </div>

              <div className="skills-carousel-track">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="skill-section premium-card single-slide"
                  >
                    <div className="skill-section-header">
                      <div className="skill-icon-wrapper">
                        <span className="skill-icon">{getCategoryIcon(skillSections[currentIndex])}</span>
                        <div className="icon-glow-ring"></div>
                      </div>
                      <div className="skill-header-text">
                        <h3>{skillSections[currentIndex].title}</h3>
                        <span className="category-tag">
                          {skillSections[currentIndex].category || 'Core Technologies'}
                        </span>
                      </div>
                    </div>

                    <div className="section-card-divider">
                      <div className="divider-line"></div>
                      <span className="divider-count">{skillSections[currentIndex].skills?.length || 0} Skills</span>
                    </div>

                    <div className="skill-items">
                      {(skillSections[currentIndex].skills || []).map((skill, skillIndex) => (
                        <motion.div
                          key={skillIndex}
                          className="skill-chip"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: skillIndex * 0.05, duration: 0.3 }}
                          whileHover={{ scale: 1.06, y: -3 }}
                        >
                          <span className="chip-bullet">•</span>
                          <span className="chip-text">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              <div className="skills-pagination-dots">
                {skillSections.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pagination-dot ${currentIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* 2. PREMIUM GRID PRESENTATION (Desktop default) */
            <div className="skills-wrapper">
              {skillSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id || sectionIndex}
                  className="skill-section premium-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: sectionIndex * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="skill-section-header">
                    <div className="skill-icon-wrapper">
                      <span className="skill-icon">{getCategoryIcon(section)}</span>
                      <div className="icon-glow-ring"></div>
                    </div>
                    <div className="skill-header-text">
                      <h3>{section.title}</h3>
                      <span className="category-tag">
                        {section.category || 'Core Technologies'}
                      </span>
                    </div>
                  </div>

                  <div className="section-card-divider">
                    <div className="divider-line"></div>
                    <span className="divider-count">{section.skills?.length || 0} Skills</span>
                  </div>

                  <div className="skill-items">
                    {(section.skills || []).map((skill, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        className="skill-chip"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ 
                          delay: sectionIndex * 0.1 + skillIndex * 0.04, 
                          duration: 0.3 
                        }}
                        whileHover={{ scale: 1.06, y: -3 }}
                      >
                        <span className="chip-bullet">•</span>
                        <span className="chip-text">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
