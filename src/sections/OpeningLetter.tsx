import { motion, useScroll, useTransform } from 'framer-motion';
import { DATA } from '../utils/constants';
import { useRef } from 'react';
import { sfx } from '../utils/sfx';

export default function OpeningLetter() {
  const ref = useRef<HTMLDivElement>(null);
  const hasPlayedRef = useRef(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const ySticker1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySticker2 = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const ySticker3 = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const yParallaxFloral = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={ref} className="relative w-full py-28 px-4 flex items-center justify-center overflow-hidden bg-ivory-cream/40 border-y border-warm-cream">
      {/* Full-bleed Watercolor Floral Parallax Background */}
      <motion.img
        src="/parallax/floral_watercolor.webp"
        alt="Floral Watercolor Background"
        style={{ y: yParallaxFloral }}
        className="absolute -bottom-10 -right-10 md:-right-20 w-[75%] md:w-[45%] max-w-2xl opacity-20 mix-blend-multiply pointer-events-none select-none z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.2 }}
        viewport={{ once: true }}
      />

      {/* Mini Parallax Stickers surrounding the letter */}
      <motion.img 
        src="/stickers/cassette.webp" 
        alt="Mini Cassette"
        style={{ y: ySticker1, rotate: -12 }}
        className="absolute top-12 left-6 md:left-24 w-28 md:w-36 z-10 drop-shadow-md pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.9, scale: 1 }}
        viewport={{ once: true }}
      />

      <motion.img 
        src="/stickers/strip.webp" 
        alt="Photo Film Strip"
        style={{ y: ySticker2, rotate: -6 }}
        className="absolute top-36 left-2 md:left-12 w-20 md:w-28 z-10 drop-shadow-lg pointer-events-none opacity-85"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.85, scale: 1 }}
        viewport={{ once: true }}
      />

      <motion.img 
        src="/stickers/digicam.webp" 
        alt="Vintage Cam"
        style={{ y: ySticker2, rotate: 10 }}
        className="absolute bottom-12 right-6 md:right-28 w-28 md:w-40 z-10 drop-shadow-lg pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.95, scale: 1 }}
        viewport={{ once: true }}
      />

      <motion.img 
        src="/stickers/letter2.webp" 
        alt="Handwritten Note"
        style={{ y: ySticker1, rotate: 14 }}
        className="absolute bottom-20 left-6 md:left-20 w-24 md:w-32 z-10 drop-shadow-md pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.9, scale: 1 }}
        viewport={{ once: true }}
      />

      <motion.img 
        src="/stickers/stamp.webp" 
        alt="Postage Stamp"
        style={{ y: ySticker3, rotate: 6 }}
        className="absolute top-16 right-10 md:right-32 w-24 md:w-32 z-0 drop-shadow-sm pointer-events-none opacity-80"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.8 }}
        viewport={{ once: true }}
      />

      {/* Main Opening Note Container */}
      <motion.div 
        className="relative z-10 w-full max-w-2xl bg-cream p-8 md:p-14 shadow-xl rounded-sm border border-dark-cream"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationStart={() => {
          if (!hasPlayedRef.current) {
            sfx.play('whoosh');
            hasPlayedRef.current = true;
          }
        }}
      >
        {/* Washi Tape Header */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-warm-cream/70 backdrop-blur-xs shadow-xs border border-dark-cream/40 -rotate-1" />

        <div className="text-center">
          <p className="font-mono text-wine-red text-xs uppercase tracking-widest mb-3">
            Chapter 01 · A Letter for You
          </p>
          
          <h2 className="font-script text-3xl md:text-5xl text-dark-burgundy leading-tight mb-6">
            "{DATA.introTitle}"
          </h2>

          <div className="w-12 h-[1px] bg-wine-red/30 mx-auto mb-6" />

          <p className="font-mono text-dark-burgundy/85 text-sm md:text-base leading-relaxed tracking-wide">
            {DATA.introText}
          </p>

          <p className="font-script text-2xl text-vintage-burgundy mt-8">
            — Forever your safe space
          </p>
        </div>

        {/* Small stamp decoration */}
        <div className="absolute -bottom-3 right-6 w-16 h-5 bg-soft-cream/80 border-t border-b border-dark-cream rotate-3" />

        {/* Vintage Floral Accent */}
        <img 
          src="/stickers/flower-2.webp" 
          alt="Flower Accent"
          className="absolute -bottom-6 -left-6 w-20 md:w-24 drop-shadow-md pointer-events-none select-none -rotate-12"
        />
      </motion.div>
    </section>
  );
}
