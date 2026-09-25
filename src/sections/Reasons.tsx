import { DATA } from '../utils/constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';

function StripFrame({
  reason,
  index,
}: {
  reason: { id: number; title: string; text: string; img: string };
  index: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [darkroomPhase, setDarkroomPhase] = useState<'initial' | 'developing' | 'revealed'>('initial');
  const hasTriggeredRef = useRef(false);

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

  // Darkroom reveal process trigger on first interaction
  useEffect(() => {
    if (isFlipped && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      setDarkroomPhase('developing');
      setTimeout(() => sfx.play('camera-shutter'), 350);
      const timer = setTimeout(() => {
        setDarkroomPhase('revealed');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isFlipped]);

  return (
    <div 
      className="w-full aspect-square relative cursor-pointer select-none group focus:outline-hidden focus:ring-2 focus:ring-cream/50 rounded-xs"
      style={{ perspective: 1000 }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Frame ${index + 1}: ${reason.title}. Klik untuk membalik.`}
    >
      <div 
        className="w-full h-full relative transition-transform duration-700 ease-out"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
        }}
      >
        {/* Front Photo (Style A: Vintage Darkroom Reveal) */}
        <div 
          className="absolute inset-0 bg-[#140507] rounded-xs overflow-hidden border border-black/25 shadow-inner flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <motion.img 
            src={reason.img} 
            alt={reason.title} 
            className="w-full h-full object-cover filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-500" 
            loading="lazy"
            animate={{
              filter:
                darkroomPhase === 'revealed'
                  ? 'brightness(1) sepia(0) contrast(1.05)'
                  : darkroomPhase === 'developing'
                  ? [
                      'brightness(0.2) sepia(1) contrast(1.3)',
                      'brightness(0.7) sepia(0.7) contrast(1.2)',
                      'brightness(1) sepia(0) contrast(1.05)',
                    ]
                  : 'brightness(0.95) sepia(0.08) contrast(1.05)',
            }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />

          {/* Darkroom Safelight Glow during developing */}
          {darkroomPhase === 'developing' && (
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,120,40,0.35)_0%,_transparent_75%)] pointer-events-none"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2.2 }}
            />
          )}

          {/* Subtle warm vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          
          {/* Top Left Number Stamp */}
          <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-cream/90 tracking-wider">
            #{String(index + 1).padStart(2, '0')}
          </div>

          {/* Developing Indicator Badge */}
          {darkroomPhase === 'developing' && (
            <div className="absolute top-2.5 right-2.5 bg-black/75 px-1.5 py-0.5 rounded-xs border border-amber-400/50">
              <span className="font-mono text-[8px] text-amber-300 animate-pulse tracking-widest uppercase">
                ● Developing
              </span>
            </div>
          )}

          {/* Flip Hint */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/50 group-hover:bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-mono text-white/90 tracking-wider transition-colors flex items-center gap-1">
            <span>tap to read</span>
            <span className="text-[11px] leading-none">↺</span>
          </div>
        </div>

        {/* Back Reason Note */}
        <div 
          className="absolute inset-0 bg-[#2d050a] text-cream p-5 rounded-xs border border-amber-200/20 shadow-inner flex flex-col justify-between text-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Paper texture overlay & inner dashed border */}
          <div className="absolute inset-2 border border-dashed border-cream/20 rounded-xs pointer-events-none" />
          
          <div className="relative z-10 pt-2">
            <span className="font-mono text-[10px] text-amber-200/80 tracking-widest uppercase">
              {reason.title}
            </span>
          </div>

          <div className="relative z-10 px-2 my-auto">
            <p className="font-serif text-sm sm:text-base leading-relaxed text-cream/95 italic">
              "{reason.text}"
            </p>
          </div>

          <div className="relative z-10 pb-2">
            <span className="font-mono text-[9px] text-cream/40 tracking-wider uppercase">
              tap to see photo ↺
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reasons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerPlayedRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax offsets tailored for each sticker element
  const yKoran = useTransform(scrollYProgress, [0, 1], [-80, 120]);
  const yKiss = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const yWax = useTransform(scrollYProgress, [0, 1], [-30, 90]);
  const yVinyl = useTransform(scrollYProgress, [0, 1], [60, -100]);
  const yMiniCam = useTransform(scrollYProgress, [0, 1], [20, -50]);
  const yQuote = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const yCassette = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const yStamp = useTransform(scrollYProgress, [0, 1], [110, -110]);
  const yRedStar = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yLetter = useTransform(scrollYProgress, [0, 1], [80, -40]);
  const yStarTop = useTransform(scrollYProgress, [0, 1], [20, -60]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full py-28 md:py-36 overflow-hidden border-y border-black/40"
      style={{
        backgroundColor: '#38070F',
        backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(185, 28, 48, 0.28) 0%, transparent 70%), radial-gradient(#1f0307 22%, transparent 23%)',
        backgroundSize: '100% 100%, 7px 7px'
      }}
    >
      {/* Full-bleed Parallax Curve Background */}
      <motion.img
        src="/parallax/burgundy_curve.webp"
        alt="Burgundy Curve Overlay"
        style={{ y: yQuote }}
        className="absolute -top-16 -left-16 md:-left-32 w-[110%] max-w-none opacity-15 mix-blend-screen pointer-events-none select-none z-0"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 relative z-30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          onAnimationStart={() => {
            if (!headerPlayedRef.current) {
              sfx.play('whoosh');
              headerPlayedRef.current = true;
            }
          }}
        >
          <p className="font-mono text-cream/70 text-xs sm:text-sm uppercase tracking-widest mb-3">
            ✦ Scrapbook Photostrip · Chapter 02 ✦
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream italic tracking-wide">
            "Reason Why I Love You"
          </h2>
          <p className="font-mono text-cream/60 text-xs mt-3">
            [ 6 Bingkai Cerita · Ketuk tiap foto untuk membaca ]
          </p>
        </motion.div>

        {/* Central Photobooth Composition */}
        <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
          
          {/* Top Right: Glass Star */}
          <motion.div 
            style={{ y: yStarTop }}
            className="absolute -top-10 right-2 sm:right-6 md:right-10 z-40 pointer-events-none"
            animate={{ rotate: [0, 8, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 100 100" className="w-12 sm:w-16 h-12 sm:h-16 drop-shadow-[0_4px_12px_rgba(255,255,255,0.45)]">
              <polygon points="50,5 63,38 98,38 69,59 82,92 50,70 18,92 31,59 2,38 37,38" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.95)" strokeWidth="2" />
            </svg>
          </motion.div>

          {/* Left Collage 1: Rolled Torn Newspaper Scrap */}
          <motion.img 
            src="/stickers/koran.webp" 
            alt="Torn Newspaper"
            style={{ y: yKoran, rotate: -4 }}
            className="absolute top-36 sm:top-44 -left-16 sm:-left-28 md:-left-40 w-44 sm:w-56 md:w-68 z-10 drop-shadow-2xl pointer-events-none select-none"
          />

          {/* Left Collage 2: Red Kiss Lipstick Mark */}
          <motion.div 
            style={{ y: yKiss, rotate: -14 }}
            className="absolute top-[380px] sm:top-[440px] -left-6 sm:-left-12 z-30 pointer-events-none select-none"
          >
            <svg viewBox="0 0 100 65" className="w-16 sm:w-20 h-11 sm:h-14 drop-shadow-lg fill-[#c4142d]">
              <path d="M10,32 C20,15 35,12 48,22 C52,22 65,12 80,15 C92,18 95,28 92,34 C85,38 75,34 68,36 C58,38 52,44 48,44 C44,44 38,38 28,36 C21,34 15,38 10,32 Z M14,35 C22,48 35,58 48,58 C62,58 75,48 84,35 C75,44 62,48 48,48 C35,48 22,44 14,35 Z" opacity="0.95" />
            </svg>
          </motion.div>

          {/* Left Collage 3: Cassette Tape mid-way down the 6-frame strip */}
          <motion.img 
            src="/stickers/cassette.webp" 
            alt="Cassette Tape"
            style={{ y: yCassette, rotate: -14 }}
            className="absolute top-[960px] sm:top-[1120px] -left-16 sm:-left-24 md:-left-36 w-36 sm:w-44 md:w-52 z-25 drop-shadow-xl pointer-events-none select-none"
          />

          {/* Left Collage 4: Red Star Sticker above bottom envelope */}
          <motion.div 
            style={{ y: yRedStar, rotate: -15 }}
            className="absolute bottom-48 sm:bottom-60 -left-10 sm:-left-16 md:-left-20 z-10 pointer-events-none select-none"
          >
            <svg viewBox="0 0 100 100" className="w-8 sm:w-10 h-8 sm:h-10 drop-shadow-md fill-[#a31526]">
              <polygon points="50,5 63,38 98,38 69,59 82,92 50,70 18,92 31,59 2,38 37,38" />
            </svg>
          </motion.div>

          {/* Right Collage 1: Wax Seal on Postcard */}
          <motion.div 
            style={{ y: yWax, rotate: 8 }}
            className="absolute top-40 sm:top-48 -right-10 sm:-right-16 md:-right-24 z-25 pointer-events-none"
          >
            <div className="relative">
              <div className="absolute -top-3 -left-6 w-24 h-16 bg-[#e8dcbf] -rotate-6 border border-dark-cream/40 shadow-md rounded-xs p-1.5 opacity-80 pointer-events-none">
                <p className="font-mono text-[7px] text-dark-burgundy/60 uppercase">Post Card</p>
                <div className="w-4 h-5 border border-dashed border-dark-burgundy/40 ml-auto mt-1" />
              </div>
              <img 
                src="/stickers/wax_seal.webp" 
                alt="Wax Seal" 
                className="w-20 sm:w-24 md:w-28 drop-shadow-xl relative z-10" 
              />
            </div>
          </motion.div>

          {/* Right Collage 2: Vinyl Record (Rotating behind the strip) */}
          <motion.div 
            style={{ y: yVinyl }}
            className="absolute top-[480px] sm:top-[560px] -right-18 sm:-right-28 md:-right-36 w-48 sm:w-60 md:w-72 z-10 pointer-events-none"
          >
            <motion.img 
              src="/stickers/vinyl.webp" 
              alt="Vinyl Record" 
              className="w-full h-full rounded-full drop-shadow-2xl"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
            />
          </motion.div>

          {/* Right Collage 3: Mini Vintage Camera on the Vinyl border */}
          <motion.img 
            src="/stickers/camera_leica.webp" 
            alt="Mini Camera" 
            style={{ y: yMiniCam, rotate: 12 }}
            className="absolute top-[590px] sm:top-[690px] right-2 sm:right-6 z-25 w-14 sm:w-18 drop-shadow-xl pointer-events-none select-none"
          />

          {/* Right Collage 4: Handwritten Script Cutout */}
          <motion.div 
            style={{ y: yQuote, rotate: -6 }}
            className="absolute top-[700px] sm:top-[820px] -right-12 sm:-right-20 md:-right-28 z-20 pointer-events-none bg-cream/90 px-3 py-1.5 shadow-md border border-dark-cream rounded-xs max-w-[130px] sm:max-w-[150px] text-center"
          >
            <p className="font-script text-base sm:text-lg text-burgundy leading-tight">
              "we loved with a love that was more than love"
            </p>
          </motion.div>

          {/* Right Collage 5: Postage Stamp Lower-Right */}
          <motion.img 
            src="/stickers/stamp.webp" 
            alt="Postage Stamp"
            style={{ y: yStamp, rotate: 10 }}
            className="absolute top-[1250px] sm:top-[1400px] -right-10 sm:-right-18 md:-right-24 w-28 sm:w-36 md:w-40 z-20 drop-shadow-lg pointer-events-none select-none"
          />

          {/* 1. Polaroid Camera on Top */}
          <motion.div 
            className="relative z-30 flex flex-col items-center"
            initial={{ y: -40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <img 
              src="/stickers/kamera.webp" 
              alt="Polaroid OneStep 2" 
              className="w-64 sm:w-76 md:w-84 drop-shadow-[0_22px_38px_rgba(0,0,0,0.85)] select-none pointer-events-none" 
            />
          </motion.div>

          {/* 2. The 6-Frame Photobooth Strip (Ejected from camera slot) */}
          <motion.div 
            className="relative z-20 -mt-8 sm:-mt-10 w-[280px] sm:w-[320px] md:w-[340px] bg-[#FAF8F5] p-3.5 sm:p-4 rounded-b-sm shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] border border-[#e2d8c3]"
            initial={{ scaleY: 0.95, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Top slot cutout look where the film emerged */}
            <div className="w-full h-1 bg-[#1a1a1a]/15 rounded-full mb-3" />

            {/* 6 Photo Frames Stacked Vertically */}
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {DATA.reasons.map((reason, idx) => (
                <StripFrame key={reason.id} reason={reason} index={idx} />
              ))}
            </div>

            {/* Bottom Margin of Photobooth Strip */}
            <div className="pt-6 pb-2 text-center border-t border-black/10 mt-5">
              <p className="font-script text-2xl md:text-3xl text-burgundy tracking-wide">
                reasons why you're my favorite
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-burgundy/60 uppercase tracking-widest mt-2 px-1">
                <span>N° 280127-18</span>
                <span>•</span>
                <span>28 · 01 · 2027</span>
                <span>•</span>
                <span>Ayudya & Rendra</span>
              </div>
            </div>
          </motion.div>

          {/* Bottom Collage: Airmail Letter with Red Rose (Positioned on the side, not covering text or photos) */}
          <motion.img 
            src="/stickers/letter.webp" 
            alt="Airmail Envelope and Red Rose"
            style={{ y: yLetter, rotate: -8 }}
            className="absolute -bottom-6 sm:-bottom-10 -left-12 sm:-left-20 md:-left-28 w-28 sm:w-36 md:w-44 z-10 drop-shadow-xl pointer-events-none select-none"
          />

        </div>

      </div>
    </section>
  );
}
