import { motion } from 'framer-motion';
import { useState } from 'react';
import { sfx } from '../utils/sfx';
import ayud1 from '../assets/images/ayud1.webp';
import aynun from '../assets/images/aynun.webp';
import ayud2 from '../assets/images/ayud-2.webp';

interface FilmFrame {
  id: number;
  src: string;
  frameNum: string;
  timestamp: string;
  subtext: string;
}

const frames: FilmFrame[] = [
  {
    id: 0,
    src: ayud1,
    frameNum: '01A',
    timestamp: '28.01.2027 · AYUDYA',
    subtext: 'First Chapter',
  },
  {
    id: 1,
    src: aynun,
    frameNum: '02A',
    timestamp: '28.01.2027 · AYUDYA',
    subtext: 'Sweetest Smile',
  },
  {
    id: 2,
    src: ayud2,
    frameNum: '03A',
    timestamp: '28.01.2027 · AYUDYA',
    subtext: 'Forever Memory',
  },
];

export default function FilmStrip() {
  const [activeIdx, setActiveIdx] = useState(1); // Center default

  const handleSelect = (idx: number) => {
    if (idx !== activeIdx) {
      sfx.play('camera-shutter');
      setActiveIdx(idx);
    } else {
      sfx.play('click');
    }
  };

  return (
    <div className="w-full py-8 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* 35mm Negative Film Strip Container */}
      <motion.div
        className="w-full max-w-5xl bg-[#141414] rounded-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-y-4 border-[#222] relative p-4 sm:p-6 overflow-hidden"
        initial={{ x: -120, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Subtle Film Grain Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* TOP FILM SPROCKET HOLES (Perforations) */}
        <div className="w-full flex items-center justify-between px-2 sm:px-4 mb-4 sm:mb-6 border-b border-white/10 pb-3">
          {/* Film Edge Branding */}
          <div className="hidden sm:flex items-center gap-6 font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
            <span>KODAK GOLD 200</span>
            <span>·</span>
            <span>36 EXP</span>
            <span>·</span>
            <span>ISO 200/24°</span>
          </div>

          {/* Sprocket Holes Pattern */}
          <div className="flex items-center gap-2 sm:gap-3.5 mx-auto sm:mx-0 overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="w-3.5 sm:w-4 h-5 sm:h-6 bg-[#080808] rounded-xs border border-white/15 shadow-inner shrink-0"
              />
            ))}
          </div>

          {/* Film Barcode Graphic */}
          <div className="hidden md:flex items-center gap-1 opacity-40">
            <span className="w-0.5 h-4 bg-amber-400" />
            <span className="w-1 h-4 bg-amber-400" />
            <span className="w-0.5 h-4 bg-amber-400" />
            <span className="w-1.5 h-4 bg-amber-400" />
            <span className="font-mono text-[8px] text-amber-400 ml-1">DX-2801</span>
          </div>
        </div>

        {/* 3 PHOTO FRAMES ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-4 items-center justify-center">
          {frames.map((frame, idx) => {
            const isActive = activeIdx === idx;

            return (
              <motion.div
                key={frame.id}
                onClick={() => handleSelect(idx)}
                className={`relative cursor-pointer rounded-xs transition-all duration-500 flex flex-col items-center group ${
                  isActive ? 'z-20' : 'z-10'
                }`}
                animate={{
                  scale: isActive ? 1.03 : 0.94,
                  opacity: isActive ? 1 : 0.65,
                }}
                whileHover={{
                  scale: isActive ? 1.05 : 0.98,
                  opacity: 0.95,
                }}
              >
                {/* Photo Frame Window (Film Negative Aperture) */}
                <div
                  className={`w-full aspect-[4/5] bg-black p-2 rounded-xs border-2 transition-colors duration-500 relative overflow-hidden shadow-2xl ${
                    isActive
                      ? 'border-amber-400/80 shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                      : 'border-white/15 group-hover:border-white/40'
                  }`}
                >
                  {/* Photo with Film Tone Filter */}
                  <div className="w-full h-full relative overflow-hidden rounded-2xs bg-[#1a1a1a]">
                    <img
                      src={frame.src}
                      alt={`Moment ${frame.frameNum}`}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isActive
                          ? 'brightness-100 contrast-105 saturate-110 scale-100'
                          : 'brightness-75 contrast-95 saturate-80 blur-[0.4px] group-hover:brightness-90 group-hover:blur-0'
                      }`}
                    />

                    {/* Film Light Leak Overlay on Active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-red-500/10 mix-blend-screen pointer-events-none" />
                    )}

                    {/* 90s Film Camera Digital Date Stamp (Orange Dot Matrix Style) */}
                    <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded-xs pointer-events-none backdrop-blur-xs">
                      <span className="font-mono text-[9px] text-[#ff6b2b] tracking-wider font-bold drop-shadow-[0_0_4px_rgba(255,107,43,0.8)]">
                        '27  1 28
                      </span>
                    </div>

                    {/* Frame Number Tag Top-Left */}
                    <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded-xs pointer-events-none">
                      <span className="font-mono text-[9px] text-amber-300 font-bold tracking-widest">
                        ▷ {frame.frameNum}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Film Frame Caption / Camera Timestamp */}
                <div className="mt-3 text-center w-full">
                  <p
                    className={`font-mono text-[11px] tracking-widest uppercase transition-colors duration-300 font-bold ${
                      isActive ? 'text-amber-300' : 'text-cream/40 group-hover:text-cream/75'
                    }`}
                  >
                    {frame.timestamp}
                  </p>
                  <p className="font-script text-base text-cream/70 mt-0.5">{frame.subtext}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM FILM SPROCKET HOLES (Perforations) */}
        <div className="w-full flex items-center justify-between px-2 sm:px-4 mt-4 sm:mt-6 border-t border-white/10 pt-3">
          {/* Frame Number Indicators */}
          <div className="hidden sm:flex items-center gap-8 font-mono text-[10px] text-amber-400/80 tracking-widest">
            <span>▷ 1</span>
            <span>▷ 2</span>
            <span>▷ 3</span>
            <span>▷ 4</span>
          </div>

          {/* Sprocket Holes Pattern */}
          <div className="flex items-center gap-2 sm:gap-3.5 mx-auto sm:mx-0 overflow-hidden">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={`bot-${i}`}
                className="w-3.5 sm:w-4 h-5 sm:h-6 bg-[#080808] rounded-xs border border-white/15 shadow-inner shrink-0"
              />
            ))}
          </div>

          {/* Film Safety Mark */}
          <div className="hidden md:flex items-center gap-2 font-mono text-[8px] text-amber-400/60 uppercase tracking-widest">
            <span>SAFETY FILM</span>
            <span>·</span>
            <span>28A</span>
          </div>
        </div>
      </motion.div>

      {/* Subtle Hint */}
      <p className="font-mono text-[10px] text-burgundy/50 tracking-widest uppercase mt-4">
        ✦ Click any photo on the 35mm film strip to inspect ✦
      </p>
    </div>
  );
}
