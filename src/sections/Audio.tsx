import { motion } from 'framer-motion';
import MusicPlayer from '../components/MusicPlayer';

export default function Audio() {
  return (
    <section 
      id="music" 
      className="relative w-full min-h-screen py-24 md:py-32 flex flex-col items-center justify-center overflow-hidden bg-oxblood text-cream"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,48,60,0.25)_0%,_transparent_75%)] pointer-events-none" />

      {/* Full-bleed Parallax Floral Flourish */}
      <img
        src="/parallax/floral_02.webp"
        alt="Floral Background"
        className="absolute -top-12 -left-16 md:-left-24 w-[70%] md:w-[45%] max-w-2xl opacity-15 mix-blend-screen pointer-events-none select-none z-0"
      />
      <img
        src="/parallax/burgundy_curve.webp"
        alt="Burgundy Curve Background"
        className="absolute -bottom-16 -right-12 w-[80%] md:w-[50%] max-w-2xl opacity-20 mix-blend-multiply pointer-events-none select-none z-0"
      />

      {/* Section Header */}
      <motion.div 
        className="text-center mb-10 sm:mb-14 px-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-mono text-cream/70 text-xs sm:text-sm uppercase tracking-widest mb-3">
          ✦ Chapter 03 · A Song For You ✦
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream italic leading-tight">
          "This song reminds me of you"
        </h2>
        <p className="font-mono text-cream/75 text-xs sm:text-sm max-w-lg mx-auto mt-3 leading-relaxed">
          Every melody holds a piece of you. Put your headphones on and let the record play.
        </p>
      </motion.div>

      {/* Music Player Widget */}
      <MusicPlayer />
    </section>
  );
}
