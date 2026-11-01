// src/components/ScrollRevealWrapper.js
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function ScrollRevealWrapper({ children, delay = 0 }) {
  // Low threshold and negative rootMargin ensures content reveals immediately without white gaps
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.02,
    rootMargin: "0px 0px -30px 0px"
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] } 
    },
  };

  return (
    <motion.div 
      ref={ref} 
      initial="hidden" 
      animate={inView ? "visible" : "hidden"} 
      variants={variants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
