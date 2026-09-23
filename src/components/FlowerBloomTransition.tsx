import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FlowerBloomTransitionProps {
  onComplete: () => void;
}

type BloomPhase = 'bg-entry' | 'blooming' | 'bloomed-motion' | 'disappearing' | 'bg-exit';

export default function FlowerBloomTransition({ onComplete }: FlowerBloomTransitionProps) {
  const [phase, setPhase] = useState<BloomPhase>('bg-entry');

  useEffect(() => {
    // 1. Phase 1: Background Entry (White mist -> 25% Burgundy -> Primary Dark Theme) for exactly 3.0s
    const t1 = setTimeout(() => {
      setPhase('blooming');
    }, 3000);

    // 2. Phase 2: Staggered blooming across the full screen over 2.5s -> switches to full bloom motion at 5.5s
    const t2 = setTimeout(() => {
      setPhase('bloomed-motion');
    }, 5500);

    // 3. Phase 3: Full bloomed motion runs for 2.5s -> switches to disappearing at 8.0s
    const t3 = setTimeout(() => {
      setPhase('disappearing');
    }, 8000);

    // 4. Phase 4: Staggered flower disappear (2.0s) -> switches to background exit at 10.0s
    const t4 = setTimeout(() => {
      setPhase('bg-exit');
    }, 10000);

    // 5. Phase 5: Background Exit (Primary -> 25% Burgundy -> White mist fade) for 3.0s -> complete at 13.0s
    const t5 = setTimeout(() => {
      onComplete();
    }, 13000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  // Show flowers during blooming and full-bloom motion phases
  const showFlowers = phase === 'blooming' || phase === 'bloomed-motion';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-none select-none bg-[#1f0407] transform-gpu"
    >
      {/* =================================================================== */}
      {/* 1. PRIMARY DEEP ROMANTIC BACKGROUND & RADIAL GLOW (3s Transition)  */}
      {/* =================================================================== */}
      <motion.div
        className="absolute inset-0 bg-[#1f0407] pointer-events-none transform-gpu"
        initial={{ opacity: 0.4 }}
        animate={{
          opacity: phase === 'bg-entry' ? [0.35, 0.75, 1] : phase === 'bg-exit' ? [1, 0.6, 0] : 1,
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        }}
      >
        {/* Ambient Radial Burgundy Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,48,60,0.5)_0%,_rgba(31,4,7,0.98)_75%)]" />

        {/* Full-bleed Botanical Wallpaper Backdrop */}
        <motion.img
          src="/parallax/botanical_wallpaper.webp"
          alt="Botanical Wallpaper"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen pointer-events-none transform-gpu"
          initial={{ opacity: 0.1 }}
          animate={{
            opacity: showFlowers ? 0.25 : 0.15,
            scale: showFlowers ? 1.04 : 1,
          }}
          transition={{ duration: 3.0, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* =================================================================== */}
      {/* 2. 25% BURGUNDY INTERMEDIATE TINT LAYER (3s Transition)            */}
      {/* =================================================================== */}
      <motion.div
        className="absolute inset-0 bg-[#800020]/25 pointer-events-none mix-blend-multiply transform-gpu"
        initial={{ opacity: 0.85 }}
        animate={{
          opacity: phase === 'bg-entry' ? [0.85, 0.4, 0] : phase === 'bg-exit' ? [0, 0.45, 0.9] : 0,
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.5, 1],
          ease: 'easeInOut',
        }}
      />

      {/* =================================================================== */}
      {/* 3. SOFT LUMINOUS WHITE MIST LAYER (3s Transition on Entry & Exit)  */}
      {/* =================================================================== */}
      <motion.div
        className="absolute inset-0 bg-[#FFFDF8] pointer-events-none transform-gpu"
        initial={{ opacity: 0.95 }}
        animate={{
          opacity: phase === 'bg-entry' ? [0.95, 0.35, 0] : phase === 'bg-exit' ? [0, 0.45, 1] : 0,
        }}
        transition={{
          duration: 3.0,
          times: [0, 0.45, 1],
          ease: 'easeInOut',
        }}
      />

      {/* =================================================================== */}
      {/* 4. SPREAD FLOWER ASSET COMPONENTS (Hardware Accelerated)           */}
      {/* =================================================================== */}
      <AnimatePresence>
        {showFlowers && (
          <>
            {/* --- CORNER BRANCHES (All 4 Corners) --- */}
            {/* 1. Corner Top-Left Branch */}
            <motion.img
              key="branch-top-left"
              src="/stickers/flower_branch_1.webp"
              alt="Blooming Branch"
              className="absolute -top-10 -left-10 sm:-top-16 sm:-left-16 w-64 sm:w-84 md:w-[26rem] drop-shadow-lg z-20 origin-top-left transform-gpu"
              initial={{ scale: 0, rotate: -40, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.03, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [6, 8, 6] : 6,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 1.0, delay: 0.6 } }}
              transition={{
                duration: 1.8,
                delay: 0.05,
                ease: [0.34, 1.56, 0.64, 1],
                rotate: phase === 'bloomed-motion' ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } : undefined,
              }}
            />

            {/* 2. Corner Top-Right Branch */}
            <motion.img
              key="branch-top-right"
              src="/stickers/flower_branch_2.webp"
              alt="Blooming Branch"
              className="absolute -top-10 -right-10 sm:-top-16 sm:-right-16 w-64 sm:w-84 md:w-[26rem] drop-shadow-lg z-20 origin-top-right -scale-x-100 transform-gpu"
              initial={{ scale: 0, rotate: 40, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.03, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-6, -8, -6] : -6,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 1.0, delay: 0.55 } }}
              transition={{
                duration: 1.8,
                delay: 0.15,
                ease: [0.34, 1.56, 0.64, 1],
                rotate: phase === 'bloomed-motion' ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } : undefined,
              }}
            />

            {/* 3. Corner Bottom-Left Branch */}
            <motion.img
              key="branch-bottom-left"
              src="/stickers/flower_branch_1.webp"
              alt="Blooming Branch"
              className="absolute -bottom-10 -left-10 sm:-bottom-16 sm:-left-16 w-64 sm:w-84 md:w-[26rem] drop-shadow-lg z-20 origin-bottom-left -scale-y-100 transform-gpu"
              initial={{ scale: 0, rotate: -40, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.03, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-6, -8, -6] : -6,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 1.0, delay: 0.5 } }}
              transition={{
                duration: 1.8,
                delay: 0.25,
                ease: [0.34, 1.56, 0.64, 1],
                rotate: phase === 'bloomed-motion' ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } : undefined,
              }}
            />

            {/* 4. Corner Bottom-Right Branch */}
            <motion.img
              key="branch-bottom-right"
              src="/stickers/flower_branch_2.webp"
              alt="Blooming Branch"
              className="absolute -bottom-10 -right-10 sm:-bottom-16 sm:-right-16 w-64 sm:w-84 md:w-[26rem] drop-shadow-lg z-20 origin-bottom-right transform-gpu"
              initial={{ scale: 0, rotate: 40, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.03, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [6, 8, 6] : 6,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 1.0, delay: 0.45 } }}
              transition={{
                duration: 1.8,
                delay: 0.35,
                ease: [0.34, 1.56, 0.64, 1],
                rotate: phase === 'bloomed-motion' ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } : undefined,
              }}
            />

            {/* --- OUTER EDGES --- */}
            {/* 5. Mid-Left Roses */}
            <motion.img
              key="roses-mid-left"
              src="/stickers/red_roses.webp"
              alt="Red Roses"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-32 sm:w-44 md:w-52 drop-shadow-md z-25 origin-left transform-gpu"
              initial={{ scale: 0, x: -30, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-8, -4, -8] : -8,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.9, delay: 0.4 } }}
              transition={{ duration: 1.6, delay: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* 6. Mid-Right Roses */}
            <motion.img
              key="roses-mid-right"
              src="/stickers/red_roses.webp"
              alt="Red Roses"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-32 sm:w-44 md:w-52 drop-shadow-md z-25 origin-right -scale-x-100 transform-gpu"
              initial={{ scale: 0, x: 30, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [8, 4, 8] : 8,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.9, delay: 0.35 } }}
              transition={{ duration: 1.6, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* 7. Mid-Top Floral Arc */}
            <motion.img
              key="bouquet-top"
              src="/stickers/boquet2.webp"
              alt="Floral Bloom Top"
              className="absolute top-2 left-1/2 -translate-x-1/2 w-36 sm:w-48 md:w-56 drop-shadow-md z-25 origin-top transform-gpu"
              initial={{ scale: 0, y: -40, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.04, 1] : 1,
                y: phase === 'bloomed-motion' ? [0, 4, 0] : 0,
                opacity: 0.95,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, delay: 0.3 } }}
              transition={{ duration: 1.6, delay: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* 8. Mid-Bottom Floral Arc */}
            <motion.img
              key="bouquet-bottom"
              src="/stickers/boquet3.webp"
              alt="Floral Bloom Bottom"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 sm:w-48 md:w-56 drop-shadow-md z-25 origin-bottom transform-gpu"
              initial={{ scale: 0, y: 40, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.04, 1] : 1,
                y: phase === 'bloomed-motion' ? [0, -4, 0] : 0,
                opacity: 0.95,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, delay: 0.25 } }}
              transition={{ duration: 1.6, delay: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* --- INNER SPREAD QUADRANTS --- */}
            {/* 9. Upper-Left Rose Bouquet */}
            <motion.img
              key="rose-upper-left"
              src="/stickers/rose_bouquet.webp"
              alt="Rose Bouquet"
              className="absolute top-16 left-10 sm:left-28 md:left-40 w-32 sm:w-40 md:w-48 drop-shadow-md z-30 origin-center transform-gpu"
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-10, -5, -10] : -10,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, delay: 0.2 } }}
              transition={{ duration: 1.5, delay: 0.85, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* 10. Upper-Right Rose Bouquet 2 */}
            <motion.img
              key="rose-upper-right"
              src="/stickers/rose_bouquet_2.webp"
              alt="Rose Bouquet 2"
              className="absolute top-16 right-10 sm:right-28 md:right-40 w-32 sm:w-40 md:w-48 drop-shadow-md z-30 origin-center transform-gpu"
              initial={{ scale: 0, rotate: 20, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [10, 5, 10] : 10,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, delay: 0.2 } }}
              transition={{ duration: 1.5, delay: 0.95, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* 11. Lower-Left Bouquet 1 */}
            <motion.img
              key="bouquet-lower-left"
              src="/stickers/boquet1.webp"
              alt="Floral Bouquet"
              className="absolute bottom-16 left-10 sm:left-28 md:left-40 w-32 sm:w-40 md:w-48 drop-shadow-md z-30 origin-center transform-gpu"
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-12, -7, -12] : -12,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, delay: 0.15 } }}
              transition={{ duration: 1.5, delay: 1.05, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* 12. Lower-Right Bouquet 2 */}
            <motion.img
              key="bouquet-lower-right"
              src="/stickers/rose_bouquet.webp"
              alt="Rose Bouquet"
              className="absolute bottom-16 right-10 sm:right-28 md:right-40 w-32 sm:w-40 md:w-48 drop-shadow-md z-30 origin-center -scale-x-100 transform-gpu"
              initial={{ scale: 0, rotate: 25, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [12, 7, 12] : 12,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.8, delay: 0.15 } }}
              transition={{ duration: 1.5, delay: 1.15, ease: [0.34, 1.56, 0.64, 1] }}
            />

            {/* --- SCATTERED ACCENT BLOSSOMS (Lightweight for Mobile & Desktop) --- */}
            {/* 13. Blossom Far Top-Left */}
            <motion.img
              key="blossom-1"
              src="/stickers/flower-1.webp"
              alt="Blossom Flower"
              className="absolute top-32 left-4 sm:left-12 w-16 sm:w-22 drop-shadow-sm z-35 transform-gpu"
              initial={{ scale: 0, rotate: -35, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.08, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-20, -12, -20] : -20,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.6, delay: 0.1 } }}
              transition={{ duration: 1.3, delay: 1.25, ease: 'easeOut' }}
            />

            {/* 14. Blossom Far Top-Right */}
            <motion.img
              key="blossom-2"
              src="/stickers/flower-2.webp"
              alt="Blossom Flower"
              className="absolute top-32 right-4 sm:right-12 w-16 sm:w-22 drop-shadow-sm z-35 transform-gpu"
              initial={{ scale: 0, rotate: 35, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.08, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [20, 12, 20] : 20,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.6, delay: 0.1 } }}
              transition={{ duration: 1.3, delay: 1.35, ease: 'easeOut' }}
            />

            {/* 15. Blossom Far Bottom-Left */}
            <motion.img
              key="blossom-3"
              src="/stickers/flower-2.webp"
              alt="Blossom Flower"
              className="absolute bottom-32 left-4 sm:left-12 w-16 sm:w-22 drop-shadow-sm z-35 transform-gpu"
              initial={{ scale: 0, rotate: -25, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.08, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [-15, -8, -15] : -15,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.6, delay: 0.05 } }}
              transition={{ duration: 1.3, delay: 1.45, ease: 'easeOut' }}
            />

            {/* 16. Blossom Far Bottom-Right */}
            <motion.img
              key="blossom-4"
              src="/stickers/flower-1.webp"
              alt="Blossom Flower"
              className="absolute bottom-32 right-4 sm:right-12 w-16 sm:w-22 drop-shadow-sm z-35 transform-gpu"
              initial={{ scale: 0, rotate: 25, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.08, 1] : 1,
                rotate: phase === 'bloomed-motion' ? [15, 8, 15] : 15,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.6, delay: 0.05 } }}
              transition={{ duration: 1.3, delay: 1.55, ease: 'easeOut' }}
            />

            {/* Desktop Additional Accents (Hidden on small mobile to preserve 60fps) */}
            <motion.img
              key="blossom-5-desktop"
              src="/stickers/rose_bear.webp"
              alt="Rose Bear Acc"
              className="hidden sm:block absolute top-1/4 left-1/3 w-24 sm:w-32 drop-shadow-md z-30 transform-gpu"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.6, delay: 0.1 } }}
              transition={{ duration: 1.4, delay: 1.65, ease: 'easeOut' }}
            />

            <motion.img
              key="blossom-6-desktop"
              src="/stickers/boquet2.webp"
              alt="Bouquet Acc"
              className="hidden sm:block absolute bottom-1/4 right-1/3 w-28 sm:w-36 drop-shadow-md z-30 transform-gpu"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: phase === 'bloomed-motion' ? [1, 1.05, 1] : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.6, delay: 0.08 } }}
              transition={{ duration: 1.4, delay: 1.75, ease: 'easeOut' }}
            />

            {/* --- BUTTERFLIES IN FLIGHT --- */}
            {/* 17. Butterfly Top-Right Quadrant */}
            <motion.img
              key="butterfly-1"
              src="/stickers/butterfly.webp"
              alt="Butterfly"
              className="absolute top-1/3 right-1/4 w-20 sm:w-26 drop-shadow-md z-40 transform-gpu"
              initial={{ scale: 0, x: 50, y: 50 }}
              animate={{
                scale: 1,
                x: phase === 'bloomed-motion' ? [0, -15, 0] : 0,
                y: phase === 'bloomed-motion' ? [0, -20, 0] : 0,
                rotate: phase === 'bloomed-motion' ? [-5, 8, -5] : 5,
              }}
              exit={{ scale: 0, x: 60, y: -40, opacity: 0, transition: { duration: 0.6 } }}
              transition={{
                scale: { duration: 1.4, delay: 1.85 },
                x: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
                y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              }}
            />

            {/* 18. Butterfly Bottom-Left Quadrant */}
            <motion.img
              key="butterfly-2"
              src="/stickers/kupu-kupu.webp"
              alt="Butterfly"
              className="absolute bottom-1/3 left-1/4 w-16 sm:w-22 drop-shadow-md z-40 transform-gpu"
              initial={{ scale: 0, x: -50, y: 50 }}
              animate={{
                scale: 1,
                x: phase === 'bloomed-motion' ? [0, 15, 0] : 0,
                y: phase === 'bloomed-motion' ? [0, -18, 0] : 0,
                rotate: phase === 'bloomed-motion' ? [5, -8, 5] : -5,
              }}
              exit={{ scale: 0, x: -60, y: -40, opacity: 0, transition: { duration: 0.6, delay: 0.05 } }}
              transition={{
                scale: { duration: 1.4, delay: 1.95 },
                x: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
                y: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
              }}
            />

            {/* --- GLOWING ROMANTIC CALLIGRAPHY CUE (Centered & Prominent) --- */}
            <motion.div
              key="calligraphy-cue"
              className="relative z-45 text-center px-4 max-w-2xl mx-auto transform-gpu"
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: phase === 'bloomed-motion' ? [1, 1.02, 1] : 1,
              }}
              exit={{ opacity: 0, y: -15, scale: 0.95, transition: { duration: 0.6 } }}
              transition={{
                opacity: { duration: 1.2, delay: 2.05 },
                y: { duration: 1.2, delay: 2.05 },
                scale: phase === 'bloomed-motion' ? { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } : undefined,
              }}
            >
              <p className="font-mono text-[11px] text-amber-200 tracking-[0.35em] uppercase mb-2 drop-shadow-md">
                ✦ FOR THE SPECIAL ONE ✦
              </p>
              <h2 className="font-script text-4xl sm:text-6xl md:text-7xl text-[#FFF5E1] drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)] leading-tight">
                Bunga-bunga bermekaran untukmu...
              </h2>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
