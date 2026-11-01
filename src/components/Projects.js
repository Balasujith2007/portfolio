import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaLayerGroup, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import Stacked3DCard from './Stacked3DCard';
import './Projects.css';

const Projects = () => {
  const { data } = usePortfolio();
  const [headerRef, headerInView] = useInView({
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

  const total = projects.length;
  const [isMobile, setIsMobile] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Responsive shift distances for the overlapping 3D stack
  const [shifts, setShifts] = useState({ shift1: 310, shift2: 530 });

  const containerRef = useRef(null);
  const touchStartX = useRef(null);

  // Detect responsive breakpoints & calculate horizontal offsets
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const mobile = vw <= 768;
      setIsMobile(mobile);

      if (vw > 1200) {
        setShifts({ shift1: 320, shift2: 540 });
      } else if (vw > 992) {
        setShifts({ shift1: 270, shift2: 460 });
      } else if (vw > 768) {
        setShifts({ shift1: 220, shift2: 380 });
      } else {
        setShifts({ shift1: 170, shift2: 300 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll tracking across the sticky section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Convert scroll progress (0..1) to continuous active index (0..total-1)
  const continuousIndex = useTransform(scrollYProgress, [0, 1], [0, total - 1]);

  // Spring physics for liquid-smooth transitions
  const smoothIndex = useSpring(continuousIndex, {
    stiffness: 120,
    damping: 24,
    mass: 0.6
  });

  // Sync active project integer index
  useMotionValueEvent(smoothIndex, 'change', (latest) => {
    if (total <= 1) return;
    const clamped = Math.max(0, Math.min(total - 1, Math.round(latest)));
    setActiveProjectIndex(clamped);
  });

  // Programmatic navigation to a specific project
  const goToProject = useCallback((targetIdx) => {
    if (targetIdx < 0 || targetIdx >= total) return;
    setActiveProjectIndex(targetIdx);

    if (!isMobile && containerRef.current && total > 1) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY || window.pageYOffset;
      const containerTop = currentScrollY + rect.top;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollableDistance = containerHeight - window.innerHeight;

      if (scrollableDistance > 0) {
        const targetScrollY = containerTop + (targetIdx / (total - 1)) * scrollableDistance;
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    }
  }, [total, isMobile]);

  // Touch swipe support on mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0 && activeProjectIndex < total - 1) {
        goToProject(activeProjectIndex + 1);
      } else if (deltaX < 0 && activeProjectIndex > 0) {
        goToProject(activeProjectIndex - 1);
      }
    }
    touchStartX.current = null;
  };

  const desktopContainerHeight = `${Math.max(160, total * 45)}vh`;

  return (
    <section
      className={`projects projects-scroll-container ${isMobile ? 'is-mobile-view' : 'is-desktop-scroll'}`}
      id="projects"
      ref={containerRef}
      style={!isMobile ? { height: desktopContainerHeight } : {}}
      aria-label="Featured Projects 3D Stack"
    >
      <div className="projects-sticky-viewport">
        {/* Section Header: Title and Subtitle */}
        <div className="projects-header-block">
          <div className="container">
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="section-title-wrap"
            >
              <h2 className="section-title">Featured Projects</h2>
              <p className="section-subtitle">
                A showcase of recent software implementations, AI applications, and full-stack platforms
              </p>
            </motion.div>
          </div>
        </div>

        {/* Empty State Fallback */}
        {total === 0 ? (
          <div className="projects-empty-state">
            <FaLayerGroup className="empty-icon" />
            <h3>No Published Projects Available</h3>
            <p>Projects will appear here once published from the admin management portal.</p>
          </div>
        ) : (
          /* 3D Overlapping Stack Arena */
          <div
            className="stacked-deck-viewport"
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchEnd={isMobile ? handleTouchEnd : undefined}
          >
            {/* Minimal Left / Right Floating Navigation Arrows */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="stack-nav-arrow arrow-left"
                  onClick={() => goToProject(activeProjectIndex - 1)}
                  disabled={activeProjectIndex === 0}
                  aria-label="Previous project in stack"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="stack-nav-arrow arrow-right"
                  onClick={() => goToProject(activeProjectIndex + 1)}
                  disabled={activeProjectIndex === total - 1}
                  aria-label="Next project in stack"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Overlapping 3D Cards Stack Container */}
            <div className="stacked-deck-container">
              {projects.map((project, index) => (
                <Stacked3DCard
                  key={project.id || index}
                  project={project}
                  index={index}
                  total={total}
                  smoothIndex={smoothIndex}
                  activeProjectIndex={activeProjectIndex}
                  isMobile={isMobile}
                  shift1={shifts.shift1}
                  shift2={shifts.shift2}
                  onCardClick={goToProject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Project Indicator & Minimal Status Bar */}
        {total > 1 && (
          <div className="gallery-bottom-indicator">
            <div className="container indicator-flex-row">
              <div className="indicator-project-meta">
                <span className="indicator-badge">
                  PROJECT {activeProjectIndex + 1 < 10 ? `0${activeProjectIndex + 1}` : activeProjectIndex + 1} / {total < 10 ? `0${total}` : total}
                </span>
                <span className="indicator-project-name">
                  {projects[activeProjectIndex]?.title}
                </span>
              </div>

              {/* Minimal Progress Dots */}
              <div className="indicator-dots-row">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`indicator-dot-pill ${activeProjectIndex === idx ? 'active' : ''}`}
                    onClick={() => goToProject(idx)}
                    aria-label={`Jump to project ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Scroll Cue Hint */}
              <div className="indicator-scroll-cue">
                <span>{isMobile ? 'Swipe cards' : 'Scroll to stack'}</span>
                <FaChevronRight className="scroll-cue-icon" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
