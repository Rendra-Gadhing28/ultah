import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Camera } from 'lucide-react';
import { sfx } from '../utils/sfx';

export default function MusicPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(193); // default 3:13 (193s)

  // Scroll parallax for stickers
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yHeadphone = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const yCassette = useTransform(scrollYProgress, [0, 1], [30, -25]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      sfx.play('click');
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      sfx.play('vinyl-scratch');
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback prevented or file loading:', err);
      });
    }
  }, [isPlaying]);

  // Global event integration for autoplay on envelope gate and floating pill
  useEffect(() => {
    const handleGlobalPlay = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn('Autoplay prevented:', err);
        });
      }
    };

    const handleGlobalPause = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleGlobalToggle = () => {
      togglePlay();
    };

    window.addEventListener('birthday-music:play', handleGlobalPlay);
    window.addEventListener('birthday-music:pause', handleGlobalPause);
    window.addEventListener('birthday-music:toggle', handleGlobalToggle);

    return () => {
      window.removeEventListener('birthday-music:play', handleGlobalPlay);
      window.removeEventListener('birthday-music:pause', handleGlobalPause);
      window.removeEventListener('birthday-music:toggle', handleGlobalToggle);
    };
  }, [isPlaying, togglePlay]);

  // Broadcast state changes for any floating controller
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('birthday-music:state', { detail: { isPlaying } }));
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    sfx.play('click');
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    sfx.play('click');
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-5xl mx-auto py-10 px-4">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/song.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Floating Sticker 1: Red-White Beats Headphone (Top-Right) */}
      <motion.div
        style={{ y: yHeadphone }}
        className="absolute -top-12 -right-4 sm:right-4 md:right-8 w-28 sm:w-36 md:w-44 z-30 pointer-events-none select-none"
      >
        <motion.img
          src="/stickers/headphone.webp"
          alt="Beats Headphones"
          className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
          animate={{ y: [0, -8, 0], rotate: [12, 14, 12] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating Sticker: Studio Headphones (Bottom-Right under phone) */}
      <motion.div
        style={{ y: yCassette }}
        className="absolute -bottom-10 right-2 sm:right-12 w-28 sm:w-36 md:w-44 z-30 pointer-events-none select-none opacity-90"
      >
        <motion.img
          src="/stickers/headphones.webp"
          alt="Studio Headphones"
          className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
          animate={{ y: [0, -7, 0], rotate: [-10, -8, -10] }}
          transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating Sticker 2: Vintage Cassette with Heart (Bottom-Left) */}
      <motion.div
        style={{ y: yCassette }}
        className="absolute -bottom-8 -left-4 sm:left-4 md:left-8 w-32 sm:w-40 md:w-48 z-30 pointer-events-none select-none"
      >
        <motion.img
          src="/stickers/rekaman.webp"
          alt="Cassette Tape"
          className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
          animate={{ y: [0, -6, 0], rotate: [-8, -6, -8] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating Sticker: Vintage Black Vinyl Sleeve / Second Vinyl (Top-Left) */}
      <motion.div
        style={{ y: yHeadphone }}
        className="absolute -top-10 -left-6 sm:left-2 md:left-6 w-32 sm:w-40 md:w-48 z-10 pointer-events-none select-none opacity-85"
      >
        <motion.img
          src="/stickers/piringan.webp"
          alt="Classic Vinyl"
          className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)]"
          animate={{ y: [0, -5, 0], rotate: [-16, -14, -16] }}
          transition={{ repeat: Infinity, duration: 5.2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Main Layout: Vinyl on Left, iPhone on Right (Stacked on mobile) */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 md:gap-14 lg:gap-20 relative z-20">
        
        {/* ================= LEFT: TURNTABLE & VINYL ================= */}
        <div className="relative flex items-center justify-center">
          
          {/* Circular Ambient Glow under Vinyl */}
          <div className="absolute inset-0 rounded-full bg-black/40 blur-2xl transform scale-90 pointer-events-none" />

          {/* Vinyl Record - Continuous 360 Rotation */}
          <motion.div
            className="w-60 h-60 sm:w-72 sm:h-72 md:w-84 md:h-84 rounded-full relative flex items-center justify-center select-none shadow-[0_25px_50px_rgba(0,0,0,0.85)] cursor-pointer group"
            onClick={togglePlay}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "linear",
            }}
          >
            <img
              src="/stickers/piringan2.png"
              alt="Vintage Floral Vinyl"
              className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
            />
            {/* Center Spindle Reflection */}
            <div className="absolute w-4 h-4 rounded-full bg-white/25 blur-[0.5px] pointer-events-none" />
          </motion.div>

          {/* Turntable Needle / Tonearm */}
          <div
            className="absolute -top-8 -right-2 sm:right-4 w-28 h-44 z-30 pointer-events-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-[80%_10%]"
            style={{
              transform: isPlaying ? 'rotate(-2deg)' : 'rotate(-20deg)',
            }}
          >
            {/* Tonearm Pivot Base */}
            <div className="absolute top-2 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#d4af37] via-[#aa820a] to-[#4a3604] shadow-xl border border-yellow-200/50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#1b0407] border border-black/40" />
            </div>

            {/* Arm Metal Rod */}
            <div
              className="absolute top-7 right-7 w-1.5 h-32 bg-gradient-to-r from-[#dcdcdc] via-[#f5f5f5] to-[#7f7f7f] shadow-lg origin-top rounded-full"
              style={{ transform: 'rotate(16deg)' }}
            >
              {/* Headshell Cartridge */}
              <div className="absolute -bottom-4 -left-2 w-5 h-7 bg-[#1c1c1c] border border-[#d4af37] rounded-xs shadow-md flex items-center justify-center">
                <div className="w-1 h-3 bg-[#d4af37] rounded-full" />
              </div>
            </div>
          </div>

          {/* Vinyl Status Hint */}
          <p className="absolute -bottom-7 font-mono text-[11px] text-cream/60 tracking-widest uppercase">
            {isPlaying ? '● Playing Vinyl' : '○ Tap to play song'}
          </p>
        </div>

        {/* ================= RIGHT: CSS iPHONE FRAME ================= */}
        <div className="w-[280px] sm:w-[310px] md:w-[330px] aspect-[9/18.5] relative rounded-[3rem] bg-[#1a0509] p-3 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] border-4 border-[#3a0810] flex flex-col select-none">
          
          {/* Subtle side buttons simulation */}
          <div className="absolute -left-[6px] top-24 w-[3px] h-8 bg-[#3a0810] rounded-l" />
          <div className="absolute -left-[6px] top-36 w-[3px] h-12 bg-[#3a0810] rounded-l" />
          <div className="absolute -left-[6px] top-52 w-[3px] h-12 bg-[#3a0810] rounded-l" />
          <div className="absolute -right-[6px] top-32 w-[3px] h-16 bg-[#3a0810] rounded-r" />

          {/* Screen Container */}
          <div className="relative flex-1 bg-gradient-to-b from-[#4d0c15] via-[#5E0F1A] to-[#3B0A12] rounded-[2.3rem] overflow-hidden flex flex-col p-4 shadow-inner border border-white/10">
            
            {/* Top Dynamic Island / Notch */}
            <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3 flex items-center justify-between px-3 z-30 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#111] border border-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#051a24] border border-[#00e5ff]/30 flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-[#00e5ff]/50" />
              </span>
            </div>

            {/* Album Art Area (Top ~6% to 61%) */}
            <div className="relative w-full aspect-square bg-[#35070e] rounded-2xl overflow-hidden border border-cream/15 shadow-xl flex flex-col items-center justify-center text-center p-4 group">
              
              {/* Decorative Romantic Background Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,48,60,0.35)_0%,_transparent_75%)] pointer-events-none" />
              <div className="absolute inset-3 border border-dashed border-cream/20 rounded-xl pointer-events-none" />

              {/* Camera Icon & Handwritten Text */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center mb-3 shadow-inner group-hover:scale-105 transition-transform">
                  <Camera className="w-7 h-7 text-cream/80" />
                </div>
                <p className="font-script text-2xl sm:text-3xl text-cream font-medium tracking-wide">
                  foto kamu di sini
                </p>
                <p className="font-mono text-[9px] text-dark-cream/70 tracking-widest uppercase mt-1">
                  Our Special Memory
                </p>
              </div>

              {/* Subtle spinning vinyl watermark when playing */}
              {isPlaying && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-[8px] text-cream/90 uppercase tracking-widest">Live</span>
                </div>
              )}
            </div>

            {/* Song Info & Controls Area (Bottom) */}
            <div className="mt-auto pt-3 flex flex-col">
              
              {/* Title & Artist */}
              <div className="mb-3 text-center">
                <h3 className="font-script text-2xl sm:text-3xl font-semibold text-cream leading-tight drop-shadow-sm">
                  Until I Found You
                </h3>
                <p className="font-display text-xs text-dark-cream/90 tracking-wider mt-0.5">
                  Stephen Sanchez
                </p>
              </div>

              {/* Clickable Progress Bar */}
              <div
                className="w-full py-2 cursor-pointer group"
                onClick={handleSeek}
              >
                <div className="w-full h-[3px] bg-black/50 rounded-full relative overflow-visible">
                  <div
                    className="h-full bg-wine-red rounded-full relative"
                    style={{ width: `${progressPct}%` }}
                  >
                    {/* Cream Dot Indicator */}
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-cream rounded-full shadow-md group-hover:scale-125 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex justify-between items-center text-[8px] font-display text-dark-cream/80 tracking-widest px-0.5 mb-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Player Control Buttons */}
              <div className="flex items-center justify-center gap-6 mt-1">
                {/* Prev Skip 10s */}
                <button
                  onClick={() => skip(-10)}
                  className="text-cream/80 hover:text-cream hover:scale-110 active:scale-95 transition-all cursor-pointer p-1"
                  aria-label="Skip back 10 seconds"
                >
                  <SkipBack className="w-5 h-5 fill-cream/30" />
                </button>

                {/* Play / Pause Circular Button */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-wine-red hover:bg-vintage-burgundy border border-cream/20 shadow-lg flex items-center justify-center text-cream hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-cream" />
                  ) : (
                    <Play className="w-5 h-5 fill-cream ml-0.5" />
                  )}
                </button>

                {/* Next Skip 10s */}
                <button
                  onClick={() => skip(10)}
                  className="text-cream/80 hover:text-cream hover:scale-110 active:scale-95 transition-all cursor-pointer p-1"
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward className="w-5 h-5 fill-cream/30" />
                </button>
              </div>

            </div>

            {/* Home Indicator Bar */}
            <div className="w-24 h-1 bg-cream/25 rounded-full mx-auto mt-3" />

          </div>
        </div>

      </div>
    </div>
  );
}
