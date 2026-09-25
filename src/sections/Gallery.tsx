import FilmStrip from '../components/FilmStrip';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { sfx } from '../utils/sfx';

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerPlayedRef = useRef(false);
  
  // Parallax effect for the whole section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -90]);
  const y3 = useTransform(scrollYProgress, [0, 1], [90, -45]);
  const y4 = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const yWallpaper = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-24 overflow-hidden">
      {/* Full-bleed Antique Botanical Wallpaper Parallax */}
      <motion.img
        src="/parallax/botanical_wallpaper.webp"
        alt="Botanical Wallpaper Background"
        style={{ y: yWallpaper }}
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none select-none z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.12 }}
        viewport={{ once: true }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <motion.div 
          className="text-center mb-10 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onAnimationStart={() => {
            if (!headerPlayedRef.current) {
              sfx.play('whoosh');
              headerPlayedRef.current = true;
            }
          }}
        >
          <p className="font-mono text-accent text-xs tracking-widest uppercase mb-2">Through My Lens</p>
          <h2 className="font-serif text-4xl md:text-5xl text-burgundy italic">
            "Favorite Moments"
          </h2>
          <p className="font-mono text-xs text-burgundy/60 mt-2 uppercase tracking-widest">
            35mm Analog Roll · 28 Jan 2027
          </p>
        </motion.div>

        {/* 35mm Negative Film Strip Gallery (Style C) */}
        <FilmStrip />

      </div>
      
      {/* Background ambient stickers (parallaxed) */}
      <motion.img 
        src="/stickers/stamp.webp" 
        alt="Vintage Stamp"
        className="absolute top-36 right-8 md:right-16 w-32 md:w-40 drop-shadow-lg z-0 pointer-events-none"
        style={{ y: y3, rotate: 12 }}
      />
      <motion.img 
        src="/stickers/frame.webp" 
        alt="Vintage Frame"
        className="absolute top-20 left-4 md:left-16 w-32 md:w-44 drop-shadow-xl z-0 pointer-events-none opacity-85"
        style={{ y: y1, rotate: -10 }}
      />
      <motion.img 
        src="/stickers/boquet1.webp" 
        alt="Flower Bouquet"
        className="absolute bottom-28 right-4 md:right-32 w-32 md:w-44 drop-shadow-xl z-10 pointer-events-none"
        style={{ y: y2, rotate: 14 }}
      />
      <motion.img 
        src="/stickers/camera_leica.webp" 
        alt="Leica Camera"
        className="absolute bottom-8 left-6 md:left-14 w-44 md:w-56 drop-shadow-xl z-20 pointer-events-none"
        style={{ y: y4, rotate: -8 }}
      />
      <motion.img 
        src="/stickers/gitar.webp" 
        alt="Red Guitar"
        className="absolute -bottom-10 right-10 md:right-24 w-36 md:w-48 drop-shadow-2xl z-20 pointer-events-none"
        style={{ y: y1, rotate: 18 }}
      />

    </section>
  );
}
