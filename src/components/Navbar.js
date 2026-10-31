import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setIsPinModalOpen, isAuthenticated, setIsAdminOpen } = usePortfolio();

  const handleLogoClick = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsPinModalOpen(true);
    }
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLogoClick();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Skills', 'Experience', 'Projects', 'Contact'];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          onClick={handleLogoClick}
          onKeyDown={handleLogoKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Portfolio Administration Access"
          title="Portfolio Administration"
        >
          <span className="logo-bracket">{'<'}</span>
          BS
          <span className="logo-bracket">{'/>'}</span>
        </motion.div>

        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          {navItems.map((item, index) => (
            <motion.li 
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <a 
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            </motion.li>
          ))}
        </ul>

        <div 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
