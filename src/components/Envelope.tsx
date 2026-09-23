import { motion } from 'framer-motion';
import { useState } from 'react';
import { DATA } from '../utils/constants';
import { sfx } from '../utils/sfx';

export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [isOpened, setIsOpened] = useState(false);
  const [plunge, setPlunge] = useState(false);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    
    // SFX Sequence & Auto-start soundtrack on trusted gesture
    sfx.play('seal-break');
    window.dispatchEvent(new CustomEvent('birthday-music:play'));

    setTimeout(() => {
      sfx.play('paper-slide');
    }, 600);

    // Letter rises, then at 1.1s begins dramatic downward plunge
    setTimeout(() => {
      setPlunge(true);
      sfx.play('whoosh');
    }, 1100);

    // Smooth transition to flower bloom at 2.4s
    setTimeout(() => {
      onOpen();
    }, 2400);
  };

  return (
    <motion.div 
      className="fixed inset-0 z-40 bg-[#1f0407] flex items-center justify-center p-4 overflow-hidden select-none"
      initial={{ opacity: 1 }}
      animate={isOpened ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1.0, delay: 1.6, ease: "easeInOut" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(155,29,48,0.25)_0%,_transparent_70%)] pointer-events-none" />

      {/* Main Envelope Body & Letter (Both plunge dramatically downward together) */}
      <motion.div 
        className="relative w-full max-w-md aspect-[4/3] rounded-md shadow-2xl overflow-visible flex items-center justify-center"
        style={{ perspective: 1200 }}
        animate={
          plunge 
            ? { y: '260%', opacity: 0, rotate: 3, scale: 0.95 } 
            : { y: 0, opacity: 1, rotate: 0, scale: 1 }
        }
        transition={
          plunge 
            ? { duration: 1.9, ease: [0.76, 0, 0.24, 1] } 
            : { duration: 0.5 }
        }
      >
        {/* 1. Envelope Inside Back Lining */}
        <div className="absolute inset-0 bg-[#35070e] rounded-md shadow-inner border border-black/40" />

        {/* 2. The Letter (Rises up, then dramatically plunges downward like a downward scroll) */}
        <motion.div 
          className="absolute z-2 w-[88%] h-[80%] bottom-3 bg-cream shadow-2xl border border-dashed border-burgundy/30 rounded-sm p-4 flex flex-col items-center justify-start text-center overflow-hidden"
          initial={{ y: 0, scale: 1, rotate: 0 }}
          animate={
            plunge
              ? { y: '280%', scale: 1.06, rotate: 4, opacity: 0 }
              : isOpened
              ? { y: '-70%', scale: 1.02, rotate: 0, opacity: 1 }
              : { y: 0, scale: 1, rotate: 0, opacity: 1 }
          }
          transition={
            plunge
              ? { duration: 1.8, ease: [0.76, 0, 0.24, 1] }
              : { duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <div className="w-full border-b border-burgundy/15 pb-2 mb-3">
            <p className="font-mono text-accent text-[11px] tracking-widest uppercase">Special Delivery</p>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-burgundy font-medium leading-tight">
            Happy 18th Birthday
          </h3>
          <p className="font-script text-xl text-accent mt-1">
            Ayudya Hanun Salsabila
          </p>
          <div className="mt-auto pb-1">
            <p className="font-mono text-[10px] text-burgundy/60 italic">With love, Rendra</p>
          </div>
        </motion.div>

        {/* 3. Left Flap */}
        <div 
          className="absolute inset-0 z-3 bg-[#4d0c15] border-l border-black/20"
          style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }}
        />

        {/* 4. Right Flap */}
        <div 
          className="absolute inset-0 z-3 bg-[#4d0c15] border-r border-black/20"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}
        />

        {/* 5. Bottom Pocket Flap (Covers bottom and holds letter) */}
        <div 
          className="absolute inset-0 z-4 bg-[#5E0F1A] border-b border-black/30 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]"
          style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 46%)' }}
        />

        {/* 6. Front Metadata Text (On lower half of envelope) */}
        <motion.div 
          className="absolute bottom-6 left-0 right-0 z-5 text-center px-4 pointer-events-none"
          animate={isOpened ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-mono text-cream/90 text-sm font-semibold tracking-wide">
            To: {DATA.receiver}
          </p>
          <p className="font-mono text-cream/60 text-xs mt-1">
            From: {DATA.sender}
          </p>
        </motion.div>

        {/* 7. Top Flap (Hinged at top, opens 180 degrees) */}
        <motion.div 
          className="absolute inset-0 origin-top bg-[#69121e] border-t border-white/10 shadow-md"
          style={{ 
            clipPath: 'polygon(0 0, 100% 0, 50% 54%)',
            backfaceVisibility: 'hidden',
          }}
          initial={{ rotateX: 0, zIndex: 10 }}
          animate={isOpened ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 10 }}
          transition={{ duration: 0.6, delay: 0.25, ease: "easeInOut" }}
        />

        {/* 8. Wax Seal Interactive Trigger */}
        <motion.div
          className="absolute z-20 cursor-pointer top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2"
          onClick={handleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={
            isOpened 
              ? { scale: [1, 0.85, 1.4], opacity: [1, 1, 0], rotate: 45 } 
              : { scale: [1, 1.04, 1] }
          }
          transition={
            isOpened 
              ? { duration: 0.45, ease: "easeOut" }
              : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }
          }
        >
          <img 
            src="/stickers/pin-surat.webp" 
            alt="Wax Seal" 
            className="w-24 h-24 md:w-28 md:h-28 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" 
          />

          {/* Golden energy burst when broken */}
          {isOpened && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-yellow-400 mix-blend-screen pointer-events-none"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>

        {/* Interactive Cue Text */}
        {!isOpened && (
          <p className="absolute -bottom-10 left-0 right-0 text-center text-cream/70 text-xs font-mono tracking-widest uppercase animate-pulse">
            ✦ Ketuk segel untuk membuka ✦
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
