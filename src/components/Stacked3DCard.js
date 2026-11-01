import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaStar } from 'react-icons/fa';

/**
 * Stacked3DCard
 * Renders a project card inside an overlapping 3D horizontal stack.
 * The center card is prominent, while neighboring cards overlap behind it with depth,
 * scaling, and 3D perspective rotation.
 */
const Stacked3DCard = ({
  project,
  index,
  total,
  smoothIndex,
  activeProjectIndex,
  isMobile,
  shift1 = 310,
  shift2 = 530,
  onCardClick
}) => {
  const isCenter = activeProjectIndex === index;
  const distance = Math.abs(activeProjectIndex - index);

  // Desktop 3D continuous scroll transforms
  // Horizontal offset X:
  const x = useTransform(
    smoothIndex,
    [index - 2, index - 1, index, index + 1, index + 2],
    [shift2, shift1, 0, -shift1, -shift2]
  );

  // Scale: 1.04 at center, 0.85 at ±1, 0.72 at ±2
  const scale = useTransform(
    smoothIndex,
    [index - 2, index - 1, index, index + 1, index + 2],
    [0.72, 0.85, 1.04, 0.85, 0.72]
  );

  // 3D Rotation Y (degrees): angles inward toward the center
  const rotateY = useTransform(
    smoothIndex,
    [index - 2, index - 1, index, index + 1, index + 2],
    [-15, -10.5, 0, 10.5, 15]
  );

  // Depth Z (px): center pops forward (+25px), neighbors recede (-90px, -190px)
  const z = useTransform(
    smoothIndex,
    [index - 2, index - 1, index, index + 1, index + 2],
    [-190, -90, 25, -90, -190]
  );

  // Opacity: center card is 100% crisp; distant cards soften gracefully
  const opacity = useTransform(
    smoothIndex,
    [index - 2.2, index - 1, index, index + 1, index + 2.2],
    [0.35, 0.88, 1.0, 0.88, 0.35]
  );

  // Discrete z-index based on distance from center
  const zIndex = Math.max(1, 50 - distance * 10);

  // On mobile: discrete CSS transitions when activeProjectIndex changes
  const mobileStyles = isMobile
    ? {
        transform: `translateX(${(index - activeProjectIndex) * (shift1 * 0.82)}px) scale(${isCenter ? 1 : 0.84}) rotateY(${isCenter ? 0 : (index - activeProjectIndex) > 0 ? -9 : 9}deg) translateZ(${isCenter ? 15 : -60}px)`,
        opacity: isCenter ? 1 : distance === 1 ? 0.75 : 0.2,
        zIndex,
        transition: 'all 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
      }
    : {
        x,
        scale,
        rotateY,
        z,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d'
      };

  return (
    <motion.div
      className={`stacked-card-wrapper ${isCenter ? 'is-active-center' : 'is-background-neighbor'}`}
      style={mobileStyles}
      onClick={() => {
        if (!isCenter && onCardClick) {
          onCardClick(index);
        }
      }}
    >
      <article className="project-item stacked-project-card">
        {/* Click hint overlay for background cards */}
        {!isCenter && (
          <div className="card-click-overlay" title={`Click to view ${project.title}`} />
        )}

        <div className="project-card-layout">
          {/* Left Column: Number Badge & Indicator */}
          <div className="project-badge-col">
            <div className="project-number">
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </div>
            <div className="project-accent-indicator" aria-hidden="true"></div>
          </div>

          {/* Main Content Area */}
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
              {/* Technology or Feature Tags */}
              <div className="project-tech-list">
                {(project.tech || []).map((tech, idx) => (
                  <span key={idx} className="tech-badge">
                    <span className="tech-badge-dot" aria-hidden="true"></span>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="project-actions-group">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-btn btn-code"
                    aria-label={`View source code for ${project.title}`}
                    tabIndex={isCenter ? 0 : -1}
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
                    aria-label={`View live demo for ${project.title}`}
                    tabIndex={isCenter ? 0 : -1}
                  >
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

export default Stacked3DCard;
