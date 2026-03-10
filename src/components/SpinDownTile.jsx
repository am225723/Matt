import React from 'react';
import { motion } from 'framer-motion';
import spinDownImage from '@/assets/images/feature-spindown.png';

/**
 * SpinDownTile — Home screen dashboard tile for TheSpinDown.
 * Matches the existing DashboardTile visual language but with a
 * premium nighttime aurora gradient and the supplied character image.
 */
const SpinDownTile = ({ onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer h-52 sm:h-56 w-full"
    >
      {/* ── Deep aurora gradient base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0d1b4b 0%, #1a0a3d 45%, #020408 100%)',
        }}
      />

      {/* ── Animated aurora glow blobs ── */}
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, #1e3a8a 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '-30%',
          left: '-10%',
        }}
        animate={{ x: [0, 15, -8, 0], y: [0, 10, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #4c1d95 0%, transparent 70%)',
          filter: 'blur(35px)',
          bottom: '-20%',
          right: '10%',
        }}
        animate={{ x: [0, -12, 8, 0], y: [0, -8, 12, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* ── Glass overlay ── */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(2px)' }}
      />

      {/* ── Hover shine ── */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
        }}
      />

      {/* ── Border glow ── */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ border: '1px solid rgba(99,179,237,0.15)' }}
      />

      {/* ── Content ── */}
      <div className="relative h-full p-4 flex items-stretch gap-3">

        {/* Character image */}
        <motion.div
          className="relative flex-shrink-0 w-32 sm:w-36"
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <img
            src={spinDownImage}
            alt="The Spin Down"
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 4px 24px rgba(99,179,237,0.25))' }}
          />
        </motion.div>

        {/* Text content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-2 gap-2">
          {/* Eyebrow label */}
          <p
            className="text-xs tracking-[0.22em] uppercase"
            style={{ color: 'rgba(99,179,237,0.55)' }}
          >
            Nighttime Tool
          </p>

          <h3
            className="text-xl sm:text-2xl font-bold tracking-tight leading-tight"
            style={{
              color: 'rgba(226,232,240,0.95)',
              textShadow: '0 0 20px rgba(99,179,237,0.15)',
            }}
          >
            The Spin Down
          </h3>

          <p
            className="text-sm sm:text-base line-clamp-3 leading-relaxed"
            style={{ color: 'rgba(148,163,184,0.8)' }}
          >
            Press your anxiety onto vinyl, breathe through it, then shatter the record.
          </p>
        </div>

        {/* Arrow */}
        <div
          className="flex-shrink-0 self-center text-blue-400/50 group-hover:text-blue-300/80 group-hover:translate-x-1 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      {/* ── Subtle bottom edge glow ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(99,179,237,0.3), transparent)',
        }}
      />
    </motion.div>
  );
};

export default SpinDownTile;