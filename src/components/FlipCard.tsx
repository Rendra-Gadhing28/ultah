import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { sfx } from '../utils/sfx';

export default function FlipCard({
  text,
  delay = 0,
  index,
  imgSrc,
}: {
  text: string;
  delay?: number;
  index: number;
  imgSrc?: string;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [darkroomPhase, setDarkroomPhase] = useState<'initial' | 'developing' | 'revealed'>('initial');
  const hasDevelopedRef = useRef(false);

  const handleClick = () => {
    sfx.play('flip');
    setIsFlipped(!isFlipped);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Trigger darkroom reveal sequence on first flip
  useEffect(() => {
    if (isFlipped && !hasDevelopedRef.current) {
      hasDevelopedRef.current = true;
      setDarkroomPhase('developing');
      setTimeout(() => {
        sfx.play('camera-shutter');
      }, 400);
      const timer = setTimeout(() => {
        setDarkroomPhase('revealed');
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  // Pick a decorative sticker based on index
  const getDecoImg = () => {
    switch (index % 4) {
      case 0:
        return '/stickers/rose_bouquet.webp';
      case 1:
        return '/stickers/rose_bear.webp';
      case 2:
        return '/stickers/red_roses.webp';
      case 3:
        return '/stickers/rose_bouquet_2.webp';
      default:
        return '/stickers/red_roses.webp';
    }
  };

  return (
    <motion.div
      className="w-full aspect-[3/4] cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Kartu alasan ${index + 1}: ${text}`}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT: VINTAGE DARKROOM REVEAL PHOTO */}
        <div
          className="absolute inset-0 backface-hidden bg-card p-2 shadow-md rounded-sm border border-burgundy/10 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex-1 bg-[#120406] rounded-xs overflow-hidden relative flex items-center justify-center border border-black/30">
            {/* Darkroom Red/Amber Safelight Ambient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,100,20,0.25)_0%,_transparent_75%)] pointer-events-none" />

            {/* Authentic photo with Darkroom developing transitions */}
            {imgSrc && (
              <motion.img
                src={imgSrc}
                alt="Ayudya Moment"
                className="w-full h-full object-cover absolute inset-0"
                initial={{ filter: 'brightness(0.1) sepia(1) contrast(1.4)' }}
                animate={{
                  filter:
                    darkroomPhase === 'revealed'
                      ? 'brightness(1) sepia(0) contrast(1.05)'
                      : darkroomPhase === 'developing'
                      ? [
                          'brightness(0.15) sepia(1) contrast(1.4)',
                          'brightness(0.65) sepia(0.8) contrast(1.25)',
                          'brightness(1) sepia(0) contrast(1.05)',
                        ]
                      : 'brightness(0.9) sepia(0.2) contrast(1.05)',
                }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
              />
            )}

            {/* Developing Chemical Bath Vignette & Film Grain Overlay */}
            {darkroomPhase === 'developing' && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-amber-950/60 via-transparent to-amber-950/40 mix-blend-color-burn pointer-events-none"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2.2 }}
              />
            )}

            {/* Small sticker on front */}
            <img
              src={getDecoImg()}
              alt="Rose decoration"
              className="w-16 absolute bottom-2 right-2 drop-shadow-md opacity-85 z-10"
            />

            {/* Darkroom Developing Badge */}
            {darkroomPhase === 'developing' && (
              <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded-xs border border-amber-400/40">
                <span className="font-mono text-[8px] text-amber-300 animate-pulse tracking-widest uppercase">
                  ● Developing
                </span>
              </div>
            )}
          </div>

          <div className="h-10 flex items-center justify-center">
            <p className="font-mono text-xs text-accent uppercase tracking-widest animate-pulse">
              Tap to reveal
            </p>
          </div>
        </div>

        {/* BACK: WRITTEN REASON NOTE */}
        <div
          className="absolute inset-0 backface-hidden bg-burgundy text-cream p-6 shadow-md rounded-sm flex items-center justify-center text-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Faded decorative background image */}
          <img
            src={getDecoImg()}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 opacity-10 blur-[1px] pointer-events-none"
          />

          <p className="font-serif text-2xl italic relative z-10 leading-relaxed">
            "{text}"
          </p>

          {/* Decorative frame on back */}
          <div className="absolute inset-3 border border-cream/20 rounded-sm pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}
