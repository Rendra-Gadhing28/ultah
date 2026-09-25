import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence, motion } from 'framer-motion';
import Preloader from './components/Preloader';
import Envelope from './components/Envelope';
import FlowerBloomTransition from './components/FlowerBloomTransition';
import Hero from './sections/Hero';
import OpeningLetter from './sections/OpeningLetter';
import Gallery from './sections/Gallery';
import Audio from './sections/Audio';
import Reasons from './sections/Reasons';
import Words from './sections/Words';
import Notes from './sections/Notes';
import FullLetter from './sections/FullLetter';
import Closing from './sections/Closing';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isGate, setIsGate] = useState(true);
  const [isBlooming, setIsBlooming] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Initialize Lenis with lock scroll during intro phases
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Lock scroll during preloader, envelope, and flower bloom
    if (isLoading || isGate || isBlooming) {
      lenis.stop();
    } else {
      lenis.start();
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [isLoading, isGate, isBlooming]);

  // Synchronize floating music pill with audio playback state
  useEffect(() => {
    const handleMusicState = (e: Event) => {
      const custom = e as CustomEvent<{ isPlaying: boolean }>;
      if (custom.detail) {
        setIsMusicPlaying(custom.detail.isPlaying);
      }
    };

    window.addEventListener('birthday-music:state', handleMusicState);
    return () => window.removeEventListener('birthday-music:state', handleMusicState);
  }, []);

  const handleEnvelopeOpen = () => {
    // Seamless transition to flower bloom with zero white flash
    setIsGate(false);
    setIsBlooming(true);
  };

  const handleBloomComplete = () => {
    setIsBlooming(false);
  };

  const toggleMusic = () => {
    window.dispatchEvent(new CustomEvent('birthday-music:toggle'));
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <Preloader 
            onComplete={() => {
              setIsLoading(false);
              window.dispatchEvent(new CustomEvent('birthday-music:play'));
            }} 
            key="preloader" 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && isGate && (
          <Envelope onOpen={handleEnvelopeOpen} key="envelope" />
        )}
      </AnimatePresence>

      {/* Full-Screen Blooming Flowers Transition (No White Flash) */}
      <AnimatePresence>
        {!isLoading && !isGate && isBlooming && (
          <FlowerBloomTransition onComplete={handleBloomComplete} key="flower-bloom" />
        )}
      </AnimatePresence>

      {/* Floating Audio Status Pill */}
      {!isLoading && !isGate && !isBlooming && (
        <motion.button
          onClick={toggleMusic}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 z-40 bg-[#35070e]/90 text-cream px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          title={isMusicPlaying ? 'Mute Music' : 'Play Music'}
        >
          <span className={`w-2 h-2 rounded-full ${isMusicPlaying ? 'bg-green-400 animate-pulse' : 'bg-cream/40'}`} />
          <span className="font-mono text-[10px] tracking-wider uppercase">
            {isMusicPlaying ? 'Until I Found You' : 'Music Paused'}
          </span>
          <div className="flex items-end gap-0.5 h-3 ml-1">
            <span className={`w-0.5 bg-cream rounded-full transition-all ${isMusicPlaying ? 'h-3 animate-pulse' : 'h-1'}`} />
            <span className={`w-0.5 bg-cream rounded-full transition-all ${isMusicPlaying ? 'h-2 animate-pulse delay-100' : 'h-1'}`} />
            <span className={`w-0.5 bg-cream rounded-full transition-all ${isMusicPlaying ? 'h-3 animate-pulse delay-200' : 'h-1'}`} />
          </div>
        </motion.button>
      )}

      <main 
        className="w-full relative min-h-screen bg-cream overflow-hidden"
        style={{
          display: (!isLoading && !isGate && !isBlooming) ? 'block' : 'none'
        }}
      >
        {!isLoading && !isGate && !isBlooming && (
          <>
            {/* 1. Hero with GSAP Drop Down Spring Landing */}
            <Hero />

            {/* 2. Opening Letter */}
            <OpeningLetter />

            {/* 3. Momen Favorit */}
            <Gallery />

            {/* 4. Lagu ini ngingetin aku sama kamu */}
            <Audio />

            {/* 5. Alasan aku sayang kamu */}
            <Reasons />

            {/* 6. Card Hadiah Ulang Tahun (Interaktif 3D Parallax & 3 Kata) */}
            <Words />

            {/* 7. Hal kecil yang bikin aku senyum */}
            <Notes />

            {/* 8. Surat cinta lengkap */}
            <FullLetter />

            {/* 9. Penutup */}
            <Closing />
          </>
        )}
      </main>
    </>
  );
}
