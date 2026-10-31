// src/components/CertCarousel.js
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CertificateCard from "./CertificateCard";

export default function CertCarousel({ certifications }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto‑slide every 4 seconds
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % certifications.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused, certifications.length]);

  const prev = () => setIndex((i) => (i - 1 + certifications.length) % certifications.length);
  const next = () => setIndex((i) => (i + 1) % certifications.length);

  return (
    <section
      className="relative py-16 bg-primary text-white"
      id="certifications"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container mx-auto px-4 overflow-hidden relative">
        {/* Navigation arrows */}
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition"
          onClick={prev}
        >
          <FaChevronLeft className="text-2xl text-white" />
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/10 backdrop-blur-lg rounded-full hover:bg-white/20 transition"
          onClick={next}
        >
          <FaChevronRight className="text-2xl text-white" />
        </button>

        {/* Carousel track */}
        <div className="flex justify-center items-center space-x-8">
          {certifications.map((cert, i) => {
            const isActive = i === index;
            return (
              <CertificateCard
                key={cert.name}
                name={cert.name}
                issuer={cert.issuer}
                icon={cert.icon}
                link={cert.link}
                active={isActive}
                width={isActive ? "260px" : "200px"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
