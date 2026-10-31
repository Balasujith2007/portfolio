// src/components/BackgroundEffects.js
import React from "react";
import { motion } from "framer-motion";
import "./BackgroundEffects.css";

// Define a set of blob configurations (size, position, animation delay)
const blobs = [
  { size: 300, top: "15%", left: "20%", delay: 0 },
  { size: 400, top: "65%", left: "70%", delay: 2 },
  { size: 250, top: "35%", left: "50%", delay: 4 },
];

export default function BackgroundEffects() {
  return (
    <div className="bg-effects">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="blob"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -20, 20, 0],
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "easeInOut",
            delay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
