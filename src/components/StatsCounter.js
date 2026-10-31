// src/components/StatsCounter.js
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const stats = [
  { label: "Problems Solved", value: 1000 },
  { label: "Contests Participated", value: 80 },
  { label: "CGPA", value: 8 },
  { label: "Projects Completed", value: 4 },
];

const AnimatedNumber = ({ target, inView }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    const duration = 2200; // ms
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ratio = Math.min(progress / duration, 1);
      setDisplay(Math.floor(ratio * target));
      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        setDisplay(target);
      }
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span className="font-bold text-4xl md:text-5xl">{display}</span>;
};

const StatsCounter = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const animation = useAnimation();
  React.useEffect(() => {
    if (inView) {
      animation.start({ opacity: 1, y: 0, transition: { staggerChildren: 0.15 } });
    }
  }, [inView, animation]);

  return (
    <section ref={ref} className="py-16 bg-primary text-white" id="statistics">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={animation}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} className="flex flex-col items-center">
              <AnimatedNumber target={stat.value} inView={inView} />
              <span className="mt-2 text-lg md:text-xl">
                {stat.label}
                {stat.label.includes("Problems") && "+"}
                {stat.label.includes("Contests") && "+"}
                {stat.label.includes("Projects") && "+"}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter;
