import { DATA } from '../utils/constants';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { sfx } from '../utils/sfx';

export default function Notes() {
  const hasPlayedRef = useRef(false);

  return (
    <section className="relative w-full py-32 overflow-hidden">
      {/* Full-bleed Antique Botanical Wallpaper Parallax Background */}
      <img
        src="/parallax/botanical_wallpaper.webp"
        alt="Botanical Wallpaper"
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none select-none z-0"
      />

      <div className="max-w-3xl mx-auto px-6 relative">
        
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onAnimationStart={() => {
            if (!hasPlayedRef.current) {
              sfx.play('whoosh');
              hasPlayedRef.current = true;
            }
          }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-burgundy italic">
            The little things you do that make me smile
          </h2>
        </motion.div>

        {/* Ambient Stickers: Vintage Letter 3 (Top Left) & Flower Bouquet 3 (Bottom Right) */}
        <motion.img 
          src="/stickers/leter3.webp" 
          alt="Vintage Letter Note" 
          className="absolute top-16 left-0 md:-left-12 w-28 md:w-36 z-0 drop-shadow-md pointer-events-none opacity-85 -rotate-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <motion.img 
          src="/stickers/boquet3.webp" 
          alt="Flower Bouquet" 
          className="absolute bottom-10 right-0 md:-right-12 w-32 md:w-44 z-0 drop-shadow-lg pointer-events-none opacity-90 rotate-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <div className="flex flex-col gap-8 md:gap-12 relative z-10">
          {DATA.littleThings.map((thing, idx) => {
            // Alternate left/right offset slightly
            const xOffset = idx % 2 === 0 ? -10 : 10;
            const rotate = idx % 2 === 0 ? -2 : 2;

            return (
              <motion.div
                key={idx}
                className="bg-[#FEF9A7] p-6 shadow-md border border-[#F2EA8D] relative w-full md:w-3/4 self-center"
                initial={{ opacity: 0, x: xOffset * 5, y: 50, rotate: rotate * 3 }}
                whileInView={{ opacity: 1, x: xOffset, y: 0, rotate: rotate }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: idx * 0.2 }}
                whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
              >
                {/* Washi tape */}
                <div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-100/60 mix-blend-multiply opacity-80"
                  style={{ transform: `translateX(-50%) rotate(${rotate * -2}deg)` }}
                />
                
                <p className="font-script text-xl md:text-3xl text-burgundy/90 text-center leading-relaxed mt-2">
                  {thing}
                </p>
                
                {/* Checkbox doodle */}
                <div className="absolute bottom-4 right-4 opacity-50">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                     <path d="M20 6L9 17l-5-5"/>
                   </svg>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
