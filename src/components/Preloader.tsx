import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  // 3500ms (3.5 seconds) loading duration
  useEffect(() => {
    const completeTimer = setTimeout(() => {
      sfx.play('whoosh');
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFF5E1] text-[#800020] overflow-hidden select-none"
      initial={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 2.2,
        filter: 'blur(16px)',
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {/* Subtle Atmosphere Streak Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-1/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent animate-pulse" />
        <div className="absolute left-2/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#800020]/60 to-transparent animate-pulse delay-100" />
        <div className="absolute left-3/4 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#800020] to-transparent animate-pulse delay-200" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center relative z-10"
      >
        {/* Pulsing Heart Centerpiece Badge */}
        <motion.div
          animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="w-16 h-16 mx-auto mb-6 bg-[#9B1D30]/15 rounded-full flex items-center justify-center shadow-inner"
        >
          <Heart className="w-8 h-8 text-[#9B1D30]" fill="currentColor" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-2xl italic mb-4 tracking-wide text-[#3B0A12]"
        >
          Preparing something special
        </motion.p>

        {/* Rhythmic Loading Text with 3 Aligned Heartbeat Mini Love Icons */}
        <div className="inline-flex items-center justify-center font-mono text-xs tracking-[0.25em] text-[#800020]/85 uppercase">
          <span>LOADING</span>
          <div className="flex items-center gap-1.5 ml-2.5">
            {[0, 0.2, 0.4].map((delay, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.35, 1, 1.2, 1],
                  opacity: [0.35, 1, 0.7, 1, 0.35],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay,
                  ease: 'easeInOut',
                }}
                className="flex items-center justify-center"
              >
                <Heart className="w-3.5 h-3.5 text-[#800020]" fill="currentColor" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
