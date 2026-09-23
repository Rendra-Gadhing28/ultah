import { motion } from 'framer-motion';
import { useState } from 'react';
import { sfx } from '../utils/sfx';

export default function FlipCard({ text, delay = 0, index, imgSrc }: { text: string, delay?: number, index: number, imgSrc?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);

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

  // Pick a random decorative image based on index
  const getDecoImg = () => {
    switch(index % 4) {
      case 0: return '/stickers/rose_bouquet.webp';
      case 1: return '/stickers/rose_bear.webp';
      case 2: return '/stickers/red_roses.webp';
      case 3: return '/stickers/rose_bouquet_2.webp';
      default: return '/stickers/red_roses.webp';
    }
  };

  return (
    <motion.div 
      className="w-full aspect-[3/4] cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
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
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 backface-hidden bg-card p-2 shadow-md rounded-sm border border-burgundy/10 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex-1 bg-burgundy/10 rounded-sm overflow-hidden relative flex items-center justify-center">
             {/* Authentic photo of Ayudya */}
             {imgSrc && (
               <img src={imgSrc} alt="Ayudya Moment" className="w-full h-full object-cover mix-blend-multiply opacity-90 absolute inset-0" />
             )}
             {/* Small sticker on front */}
             <img src={getDecoImg()} alt="Rose decoration" className="w-16 absolute bottom-2 right-2 drop-shadow-md opacity-80" />
          </div>
          <div className="h-10 flex items-center justify-center">
            <p className="font-mono text-xs text-accent uppercase tracking-widest animate-pulse">
              Tap to reveal
            </p>
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-burgundy text-cream p-6 shadow-md rounded-sm flex items-center justify-center text-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
           {/* Faded decorative background image */}
           <img src={getDecoImg()} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 opacity-10 blur-[1px] pointer-events-none" />
           
           <p className="font-serif text-2xl italic relative z-10">
             {text}
           </p>
           
           {/* Decorative frame on back */}
           <div className="absolute inset-3 border border-cream/20 rounded-sm pointer-events-none" />
        </div>

      </motion.div>
    </motion.div>
  );
}
