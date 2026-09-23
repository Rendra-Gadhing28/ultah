import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DATA } from '../utils/constants';
import { sfx } from '../utils/sfx';

export default function Closing() {
  const triggerConfetti = () => {
    sfx.play('pop');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#800020', '#9B1D30', '#B0303C', '#FFF5E1', '#F7ECD4']
    });
  };

  const shareReply = () => {
    sfx.play('click');
    const text = encodeURIComponent(`Hai ${DATA.sender}, makasih banyak buat website kado ulang tahunnya... Aku suka banget! 🤍`);
    window.open(`https://api.whatsapp.com/send?phone=${DATA.phone}&text=${text}`, '_blank');
  };

  const scrollToTop = () => {
    sfx.play('whoosh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full py-28 bg-[#1f0407] text-cream flex flex-col items-center justify-center text-center px-6 overflow-hidden border-t border-oxblood">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(155,29,48,0.2)_0%,_transparent_75%)] pointer-events-none" />

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

      {/* Floating festive stickers & Birthday Candles */}
      <div className="relative z-10 flex items-center justify-center gap-4 sm:gap-6 mb-8">
        {/* Left Candle */}
        <motion.img 
          src="/stickers/candle.webp" 
          alt="Birthday Candle"
          className="w-14 sm:w-18 md:w-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] -rotate-6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
        />

        {/* Center Cake */}
        <motion.img 
          src="/stickers/kue.webp" 
          alt="Birthday Cake"
          className="w-36 md:w-44 drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", bounce: 0.4 }}
        />

        {/* Right Candle (lilin) */}
        <motion.img 
          src="/stickers/lilin.webp" 
          alt="Lit Candle"
          className="w-14 sm:w-18 md:w-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] rotate-6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}
        />
      </div>

      <motion.div
        className="max-w-xl z-10"
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
            className="w-full sm:w-auto px-6 py-3 bg-burgundy hover:bg-vintage-burgundy text-cream font-mono text-xs tracking-wider uppercase rounded-xs shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-wine-red/50"
          >
            ✦ Rayakan Sekali Lagi ✦
          </button>

          <button 
            onClick={shareReply}
            className="w-full sm:w-auto px-6 py-3 bg-cream hover:bg-ivory-cream text-dark-burgundy font-mono text-xs tracking-wider uppercase rounded-xs shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-dark-cream"
          >
            Balas Pesan Rendra ✉
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
