import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';
import { DATA } from '../utils/constants';
import { sfx } from '../utils/sfx';
import ScratchCard from '../components/ScratchCard';

export default function Closing() {
  const [isBlown, setIsBlown] = useState(false);

  // Interactive Blow the Candles logic
  const handleBlowCandles = () => {
    if (isBlown) return;
    sfx.play('whoosh');
    setIsBlown(true);

    setTimeout(() => {
      sfx.play('pop');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D4AF37', '#9B1D30', '#B0303C', '#FFF5E1', '#F7ECD4'],
      });
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#9B1D30', '#FFF5E1'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#9B1D30', '#FFF5E1'],
      });
    }, 200);
  };

  const handleRelight = () => {
    sfx.play('click');
    setIsBlown(false);
  };

  const triggerConfetti = () => {
    sfx.play('pop');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#800020', '#9B1D30', '#B0303C', '#FFF5E1', '#F7ECD4'],
    });
  };

  const shareReply = () => {
    sfx.play('click');
    const text = encodeURIComponent(
      `Hai ${DATA.sender}, makasih banyak buat website kado ulang tahunnya... Aku suka banget! 🤍`
    );
    window.open(`https://api.whatsapp.com/send?phone=${DATA.phone}&text=${text}`, '_blank');
  };

  const scrollToTop = () => {
    sfx.play('whoosh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full py-28 bg-[#1f0407] text-cream flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden border-t border-oxblood">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(155,29,48,0.25)_0%,_transparent_75%)] pointer-events-none" />

      {/* Full-bleed Parallax Background Overlays */}
      <img
        src="/parallax/floral_02.webp"
        alt="Floral Background"
        className="absolute -top-10 -left-10 md:-left-20 w-[65%] md:w-[45%] max-w-2xl opacity-15 mix-blend-screen pointer-events-none select-none z-0"
      />
      <img
        src="/parallax/burgundy_curve.webp"
        alt="Burgundy Curve Background"
        className="absolute -bottom-10 -right-10 md:-right-20 w-[80%] md:w-[50%] max-w-2xl opacity-20 mix-blend-multiply pointer-events-none select-none z-0"
      />

      {/* =================================================================== */}
      {/* 1. INTERACTIVE BIRTHDAY CAKE & BLOW THE CANDLES GAME                */}
      {/* =================================================================== */}
      <div className="relative z-20 flex flex-col items-center justify-center max-w-xl mx-auto mb-8">
        {/* Cake with Animated Candles and Smoke Effects */}
        <div
          onClick={handleBlowCandles}
          className="relative flex items-center justify-center gap-4 sm:gap-6 mb-4 cursor-pointer group select-none"
          title={isBlown ? 'Lilin sudah ditiup' : 'Ketuk kue untuk tiup lilin'}
        >
          {/* Left Candle */}
          <div className="relative flex flex-col items-center">
            {/* Animated Flame Left */}
            <AnimatePresence>
              {!isBlown ? (
                <motion.div
                  key="flame-l"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.25, 0.95, 1.15, 1], y: [0, -2, 1, -1, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
                  className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.9)] mb-1"
                />
              ) : (
                <motion.div
                  key="smoke-l"
                  initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -25, scale: 1.5 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="w-2.5 h-6 bg-white/40 blur-[1px] rounded-full mb-1"
                />
              )}
            </AnimatePresence>
            <motion.img
              src="/stickers/candle.webp"
              alt="Birthday Candle"
              className="w-12 sm:w-16 md:w-18 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] -rotate-6 group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Center Cake */}
          <motion.div
            className="relative flex flex-col items-center"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <img
              src="/stickers/kue.webp"
              alt="Birthday Cake"
              className="w-36 sm:w-44 md:w-48 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] z-10"
            />
            {/* Ambient Candle Glow underneath */}
            {!isBlown && (
              <div className="absolute -top-6 w-32 h-16 bg-amber-400/20 rounded-full blur-xl pointer-events-none animate-pulse" />
            )}
          </motion.div>

          {/* Right Candle */}
          <div className="relative flex flex-col items-center">
            {/* Animated Flame Right */}
            <AnimatePresence>
              {!isBlown ? (
                <motion.div
                  key="flame-r"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 0.9, 1.15, 1], y: [0, -1, 1, -2, 0] }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.3, delay: 0.2, ease: 'easeInOut' }}
                  className="w-4 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.9)] mb-1"
                />
              ) : (
                <motion.div
                  key="smoke-r"
                  initial={{ opacity: 0.8, y: 0, scale: 0.8 }}
                  animate={{ opacity: 0, y: -25, scale: 1.5 }}
                  transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
                  className="w-2.5 h-6 bg-white/40 blur-[1px] rounded-full mb-1"
                />
              )}
            </AnimatePresence>
            <motion.img
              src="/stickers/lilin.webp"
              alt="Lit Candle"
              className="w-12 sm:w-16 md:w-18 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] rotate-6 group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Blow the Candle Trigger / Wish Feedback */}
        <div className="mt-2">
          {!isBlown ? (
            <button
              onClick={handleBlowCandles}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#4A0E17] font-mono text-xs uppercase tracking-wider font-bold rounded-full shadow-[0_8px_20px_rgba(251,191,36,0.4)] hover:shadow-[0_12px_28px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4A0E17]" />
              <span>Make a Wish & Tiup Lilin 🎂</span>
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-[#4A0E17]/80 rounded-xl border border-amber-300/40 shadow-xl inline-flex flex-col items-center"
            >
              <p className="font-script text-xl sm:text-2xl text-amber-200">
                ✨ Wish granted! Semoga semua impianmu terkabul! ✨
              </p>
              <button
                onClick={handleRelight}
                className="mt-2 text-[10px] font-mono text-cream/70 hover:text-cream underline uppercase tracking-widest cursor-pointer"
              >
                ✦ Nyalakan Lilin Lagi ✦
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. INTERACTIVE SECRET SCRATCH CARD GAME                             */}
      {/* =================================================================== */}
      <ScratchCard />

      {/* =================================================================== */}
      {/* 3. FINAL BIRTHDAY MESSAGE & WHATSAPP ACTION                         */}
      {/* =================================================================== */}
      <motion.div
        className="max-w-xl z-10 mt-6"
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-wine-red mb-3">
          Final Chapter · 28.01.2027
        </p>

        <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight mb-4">
          Happy 18th Birthday, <br />
          <span className="font-script text-4xl md:text-6xl text-vintage-burgundy">{DATA.receiver}</span>
        </h2>

        <p className="font-mono text-cream/75 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
          Semoga di usia 18 tahun ini, setiap langkahmu selalu dipenuhi berkah, kebahagiaan tak terhingga, dan cinta yang selalu ada untukmu.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={triggerConfetti}
            className="w-full sm:w-auto px-6 py-3 bg-burgundy hover:bg-vintage-burgundy text-cream font-mono text-xs tracking-wider uppercase rounded-xs shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-wine-red/50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>✦ Rayakan Sekali Lagi ✦</span>
          </button>

          <button
            onClick={shareReply}
            className="w-full sm:w-auto px-6 py-3 bg-cream hover:bg-ivory-cream text-dark-burgundy font-mono text-xs tracking-wider uppercase rounded-xs shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-dark-cream flex items-center justify-center gap-2 font-bold"
          >
            <Heart className="w-4 h-4 text-rose-700" fill="currentColor" />
            <span>Balas Pesan Rendra ✉</span>
          </button>
        </div>

        <button
          onClick={scrollToTop}
          className="mt-12 font-mono text-xs text-cream/40 hover:text-cream/80 transition-colors uppercase tracking-widest cursor-pointer underline underline-offset-4"
        >
          ↑ Kembali ke awal ↑
        </button>
      </motion.div>
    </section>
  );
}
