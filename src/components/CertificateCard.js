// src/components/CertificateCard.js
import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaAward } from 'react-icons/fa';

/**
 * CertificateCard: A premium, glassmorphic card for presenting credentials.
 * Features hover effects, clean typography, badge styling, and action button.
 */
const CertificateCard = ({ name, issuer, icon, year, link }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="relative flex flex-col justify-between h-[360px] w-full p-8 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(99,102,241,0.06)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.15)] transition-all duration-300 overflow-hidden group select-none"
    >
      {/* Background radial glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Futuristic corner accent borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-violet-500/20 rounded-tl-[24px] pointer-events-none group-hover:border-violet-500/40 transition-colors duration-300" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500/20 rounded-br-[24px] pointer-events-none group-hover:border-indigo-500/40 transition-colors duration-300" />

      <div>
        {/* Top: Icon + Year Badge */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500/10 to-indigo-500/10 text-3xl shadow-inner border border-violet-500/10 group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500">
            {icon ? (
              <span className="group-hover:scale-110 transition-transform duration-300">{icon}</span>
            ) : (
              <FaAward className="text-violet-500 group-hover:text-white transition-colors duration-300" />
            )}
          </div>
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100/50 shadow-sm">
            {year || '2023'}
          </span>
        </div>

        {/* Mid: Title + Organization */}
        <h4 className="text-xl font-bold text-slate-800 leading-snug mb-3 tracking-tight group-hover:text-violet-950 transition-colors duration-300">
          {name}
        </h4>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50/80 border border-slate-100/50 shadow-sm text-xs font-medium text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          {issuer}
        </div>
      </div>

      {/* Bottom: Action Button */}
      <div className="mt-6 pt-4 border-t border-slate-100/50">
        <a
          href={link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!link || link === '#') {
              e.preventDefault();
              alert(`Credential verification link for "${name}" will be added soon!`);
            }
          }}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-[0_4px_14px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.35)] active:scale-98 transition-all duration-300"
        >
          Verify Credential
          <FaExternalLinkAlt className="text-xs opacity-80" />
        </a>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
