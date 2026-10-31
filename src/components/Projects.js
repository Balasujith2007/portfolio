import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight, 
  FaStar, FaLayerGroup, FaThLarge, FaSlidersH, FaPause, FaPlay 
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import './Projects.css';

const Projects = () => {
  const { data } = usePortfolio();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const projects = data.projects && data.projects.length > 0 ? data.projects : [
    {
      id: 'proj-1',
      title: 'Smartphone Addiction Detection',
      description: 'AI-powered system for analyzing smartphone usage patterns and identifying signs of digital addiction using machine learning techniques.',
      tech: ['Usage behavior analysis', 'Addiction risk prediction', 'Data visualization dashboard', 'Machine learning insights', 'Responsive UI'],
      category: 'Machine Learning',
      github: 'https://github.com/Balasujith2007/smartphone-addition',
      featured: true,
      published: true
    },
    {
      id: 'proj-2',
      title: 'SaaS Product Platform',
      description: 'Modern SaaS platform featuring authentication, subscription-ready architecture, dashboard management, and scalable application structure.',
      tech: ['Authentication system', 'User dashboard', 'Scalable architecture', 'Responsive design', 'Secure application structure'],
      category: 'Full Stack Development',
      github: 'https://github.com/Balasujith2007/Software-as-a-service',
      featured: true,
      published: true
    },
    {
      id: 'proj-3',
      title: 'Medicine Reminder System',
      description: 'Smart medicine reminder application helping users track medications, schedules, and dosage reminders effectively.',
      tech: ['Medication scheduling', 'Reminder notifications', 'User-friendly dashboard', 'Progress tracking', 'Responsive UI'],
      category: 'Web Application',
      github: 'https://github.com/Balasujith2007/Software-as-a-service',
      featured: true,
      published: true
    },
    {
      id: 'proj-4',
      title: 'SRM Smart Student Portal',
      description: 'Comprehensive student management portal designed to streamline academic activities, student records, and campus workflows.',
      tech: ['Student management', 'Academic tracking', 'Dashboard analytics', 'Secure authentication', 'Modern responsive interface'],
      category: 'Web Application',
      github: 'https://github.com/dhyaneshdhyanesh739-ship-it/Smart-Student-Portal',
      featured: false,
      published: true
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [isMobile, setIsMobile] = useState(false);

  // Touch swipe states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);

  const total = projects.length;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setViewMode('carousel');
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Autoplay functionality: slow 6-second rotation, paused on hover/focus
  useEffect(() => {
    if (isPaused || viewMode !== 'carousel' || total <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, viewMode, total, nextSlide]);

  // Touch handlers for mobile swipe
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
    if (viewMode !== 'carousel') return;
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  // Slide transition variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 180 : -180,
      opacity: 0,
      scale: 0.96
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.35 }
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? -180 : 180,
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 28 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section 
      className="projects" 
      id="projects" 
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Featured Projects Section"
    >
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Header Row with Title and Layout Switcher */}
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle">A showcase of recent software implementations, AI applications, and full-stack platforms</p>
            </div>

            {/* Desktop View Mode Toggle */}
            {!isMobile && total > 1 && (
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                  onClick={() => setViewMode('carousel')}
                  title="Sliding Carousel View"
                  aria-label="Carousel layout"
                >
                  <FaSlidersH /> <span>Sliding Showcase</span>
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="All Projects Grid"
                  aria-label="Grid layout"
                >
                  <FaThLarge /> <span>All Projects</span>
                </button>
              </div>
            )}
          </div>

          {/* PROJECT SELECTOR TABS STRIP */}
          {total > 0 && (
            <div className="projects-nav-strip">
              {projects.map((project, idx) => (
                <button
                  key={project.id || idx}
                  type="button"
                  className={`project-tab-pill ${viewMode === 'carousel' && currentIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    goToSlide(idx);
                    if (viewMode !== 'carousel' && isMobile) setViewMode('carousel');
                  }}
                  aria-label={`Select project ${project.title}`}
                >
                  <span className="project-tab-num">0{idx + 1}</span>
                  <span className="project-tab-title">{project.title}</span>
                  {project.featured && <FaStar className="featured-star-icon" title="Featured Project" />}
                </button>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {total === 0 ? (
            <div className="projects-empty-state">
              <FaLayerGroup className="empty-icon" />
              <h3>No Published Projects Available</h3>
              <p>Projects will appear here once published from the admin management portal.</p>
            </div>
          ) : viewMode === 'carousel' ? (
            /* 1. HORIZONTAL SLIDING PROJECT CAROUSEL */
            <div 
              className="projects-carousel-wrapper"
              ref={carouselRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Top Controls */}
              <div className="carousel-top-bar">
                <div className="carousel-meta-indicator">
                  <span className="meta-badge">
                    PROJECT {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} / {total < 10 ? `0${total}` : total}
                  </span>
                  {projects[currentIndex].featured && (
                    <span className="featured-badge">
                      <FaStar /> Featured
                    </span>
                  )}
                </div>

                <div className="carousel-arrow-buttons">
                  <button
                    type="button"
                    className="arrow-btn prev"
                    onClick={prevSlide}
                    aria-label="Previous project"
                    title="Previous project (Left Arrow)"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    className="arrow-btn next"
                    onClick={nextSlide}
                    aria-label="Next project"
                    title="Next project (Right Arrow)"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>

              {/* Sliding Track */}
              <div className="carousel-viewport">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.article
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="project-item premium-project-card active-slide"
                  >
                    <div className="project-card-layout">
                      {/* Left Header / Numerical Badge */}
                      <div className="project-badge-col">
                        <div className="project-number">
                          0{currentIndex + 1}
                        </div>
                        <div className="project-accent-indicator"></div>
                      </div>

                      {/* Main Project Details */}
                      <div className="project-content">
                        <div className="project-category-row">
                          <span className="project-category">{projects[currentIndex].category}</span>
                          {projects[currentIndex].featured && (
                            <span className="featured-tag">
                              <FaStar /> Star Project
                            </span>
                          )}
                        </div>

                        <h3 className="project-title">{projects[currentIndex].title}</h3>

                        <p className="project-desc">
                          {projects[currentIndex].description}
                        </p>

                        <div className="project-footer">
                          {/* Tech Stack Chips */}
                          <div className="project-tech-list">
                            {(projects[currentIndex].tech || []).map((tech, idx) => (
                              <span key={idx} className="tech-badge">
                                <span className="tech-badge-dot"></span>
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="project-actions-group">
                            {projects[currentIndex].github && (
                              <a 
                                href={projects[currentIndex].github} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="project-btn btn-code"
                                aria-label={`View source code for ${projects[currentIndex].title}`}
                              >
                                <FaGithub /> View Code
                              </a>
                            )}
                            {projects[currentIndex].demoUrl && (
                              <a 
                                href={projects[currentIndex].demoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="project-btn btn-demo"
                                aria-label={`View live demo for ${projects[currentIndex].title}`}
                              >
                                <FaExternalLinkAlt /> Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>

              {/* Bottom Pagination Dots & Autoplay Indicator */}
              <div className="carousel-bottom-bar">
                <div className="carousel-dots-row">
                  {projects.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Jump to project ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="carousel-pause-status">
                  <span className="pause-indicator-text">
                    {isPaused ? <><FaPause /> Paused on hover</> : <><FaPlay /> Auto-sliding</>}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* 2. FULL GRID VIEW OPTION */
            <div className="projects-grid-container">
              {projects.map((project, index) => (
                <motion.article
                  key={project.id || index}
                  className="project-item premium-project-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                >
                  <div className="project-card-layout">
                    <div className="project-badge-col">
                      <div className="project-number">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </div>
                      <div className="project-accent-indicator"></div>
                    </div>

                    <div className="project-content">
                      <div className="project-category-row">
                        <span className="project-category">{project.category}</span>
                        {project.featured && (
                          <span className="featured-tag">
                            <FaStar /> Star Project
                          </span>
                        )}
                      </div>

                      <h3 className="project-title">{project.title}</h3>

                      <p className="project-desc">{project.description}</p>

                      <div className="project-footer">
                        <div className="project-tech-list">
                          {(project.tech || []).map((tech, idx) => (
                            <span key={idx} className="tech-badge">
                              <span className="tech-badge-dot"></span>
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="project-actions-group">
                          {project.github && (
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="project-btn btn-code"
                              aria-label={`View code for ${project.title}`}
                            >
                              <FaGithub /> View Code
                            </a>
                          )}
                          {project.demoUrl && (
                            <a 
                              href={project.demoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="project-btn btn-demo"
                              aria-label={`View demo for ${project.title}`}
                            >
                              <FaExternalLinkAlt /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
