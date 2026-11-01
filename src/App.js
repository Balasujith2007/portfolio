import React, { useState, useEffect } from 'react';
import './App.css';
import { PortfolioProvider } from './context/PortfolioContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Accomplishments from './components/Accomplishments';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingElements from './components/FloatingElements';
import BackgroundEffects from './components/BackgroundEffects';
import ScrollRevealWrapper from './components/ScrollRevealWrapper';
import PinModal from './components/admin/PinModal';
import AdminDashboard from './components/admin/AdminDashboard';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <div className="loader-bar"></div>
          <div className="loader-text">BS</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App relative">
      <BackgroundEffects />
      <FloatingElements />
      <Navbar />
      <Hero />
      <ScrollRevealWrapper><About /></ScrollRevealWrapper>
      <ScrollRevealWrapper><Skills /></ScrollRevealWrapper>
      <ScrollRevealWrapper><Experience /></ScrollRevealWrapper>
      <Projects />
      <ScrollRevealWrapper><Accomplishments /></ScrollRevealWrapper>
      <ScrollRevealWrapper><Contact /></ScrollRevealWrapper>
      <Footer />
      <PinModal />
      <AdminDashboard />
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;

