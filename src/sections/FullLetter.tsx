import { DATA } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sfx } from '../utils/sfx';
import ayud2Photo from '../assets/images/ayud-2.webp';
import ay4Photo from '../assets/images/ay-4.webp';

type LetterPhase = 'closed' | 'paper-rising' | 'typing' | 'done';

export default function FullLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [phase, setPhase] = useState<LetterPhase>('closed');
  const [displayedText, setDisplayedText] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleOpen = () => {
    sfx.play('seal-break');
    setIsOpen(true);
    setPhase('paper-rising');
    setDisplayedText('');

    // SFX paper sliding out of envelope
    setTimeout(() => {
      sfx.play('paper-slide');
    }, 250);

    // Fire celebratory confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#9B1D30', '#FFF5E1', '#EFE2C6'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#9B1D30', '#FFF5E1', '#EFE2C6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Typewriter logic after paper settles
  useEffect(() => {
    if (phase !== 'typing') return;

    let index = 0;
    const fullText = DATA.letter;

    typingIntervalRef.current = setInterval(() => {
      if (index < fullText.length) {
        index++;
        setDisplayedText(fullText.slice(0, index));

        // Play typewriter click every 4 characters so it feels rhythmic without being overwhelming
        if (index % 4 === 0) {
          sfx.play('typewriter');
        }
      } else {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setPhase('done');
        sfx.play('pop');
      }
    }, 26); // smooth ~26ms per character

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [phase]);

  const handleSkip = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    setDisplayedText(DATA.letter);
    setPhase('done');
    sfx.play('click');
    sfx.play('pop');
  };

  const handleReseal = () => {
    sfx.play('paper-slide');
    setIsOpen(false);
    setPhase('closed');
    setDisplayedText('');
  };

  const copyLetter = () => {
    sfx.play('click');
    navigator.clipboard.writeText(DATA.letter).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    });
  };

  return (
    <section className="relative w-full min-h-screen bg-burgundy flex flex-col items-center justify-center py-32 overflow-hidden">
      
      {/* Toast Notification on Copy */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-10 z-50 px-5 py-2.5 bg-cream text-burgundy font-mono text-xs font-semibold rounded-full shadow-2xl border border-burgundy/30 flex items-center gap-2 pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Pesan surat berhasil tersalin ke clipboard! 🤍</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Texture bg */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />

      {/* Full-bleed Vintage Floral Parallax Background */}
      <img
        src="/parallax/floral_01.webp"
        alt="Floral Background"
        className="absolute -top-16 -right-16 md:-right-32 w-[90%] md:w-[60%] max-w-4xl opacity-15 mix-blend-screen pointer-events-none select-none z-0"
      />

      {/* Top Left Polaroid with Name */}
      <motion.div 
        className="absolute top-10 left-6 md:left-24 w-44 md:w-56 z-20 drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-[#4A0E17] p-3 pb-8 shadow-xl rounded-sm border border-white/10">
          <div className="w-full aspect-square bg-burgundy/30 overflow-hidden relative rounded-xs">
            <img src={ayud2Photo} alt={DATA.receiver} className="w-full h-full object-cover" />
          </div>
          <p className="font-script text-xl text-center text-cream mt-2 tracking-wide">
            {DATA.receiver.split(' ')[0]}.
          </p>
        </div>
      </motion.div>

      {/* Butterfly fluttering near the polaroid */}
      <motion.img 
        src="/stickers/butterfly.webp" 
        alt="Butterfly" 
        className="absolute top-72 left-8 md:left-28 w-20 md:w-28 drop-shadow-xl z-30 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, -6, 0], rotate: [-4, 6, -4] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      />

      {/* Bottom Right Mini Stamp Photo */}
      <motion.div 
        className="absolute bottom-20 right-6 md:right-24 w-36 md:w-48 z-20 drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-cream p-2 pb-5 shadow-xl rounded-sm border-2 border-dashed border-burgundy/30">
          <div className="w-full aspect-square bg-burgundy/10 overflow-hidden relative">
            <img src={ay4Photo} alt="Special Memory" className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Bottom Left Signature */}
      <div className="absolute bottom-12 left-10 md:left-24 z-10 pointer-events-none">
        <p className="font-script text-2xl md:text-3xl text-cream/80">
          From : {DATA.sender}
        </p>
      </div>

      <motion.div 
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-script text-6xl md:text-8xl text-cream mb-2 drop-shadow-lg">
          # Love letter
        </h2>
        <p className="font-mono text-cream/70 text-xs md:text-sm tracking-widest uppercase">
          A SPECIAL MESSAGE JUST FOR YOU
        </p>
      </motion.div>

      <div className="relative w-[90%] max-w-2xl min-h-[60vh] flex items-center justify-center z-10">
        
        {/* Closed Envelope State */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleOpen}
            >
              <div className="w-[300px] h-[200px] bg-[#5E0F1A] rounded-sm shadow-2xl relative flex items-center justify-center border-2 border-black/10">
                 {/* Flap */}
                 <div className="absolute top-0 left-0 w-full h-[60%] bg-[#4A0E17] origin-top z-10 border-b border-black/20" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }} />
                 <div className="absolute inset-0 bg-[#6b1420] z-5 pointer-events-none" style={{ clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }} />
                 
                 <div className="absolute z-20 w-16 h-16 shadow-xl flex items-center justify-center rounded-full bg-accent/20">
                   <img src="/stickers/wax_seal.webp" alt="Wax Seal" className="w-16 h-16 drop-shadow-lg" />
                 </div>
                 <p className="absolute -bottom-8 font-mono text-cream/60 text-xs animate-pulse">
                   Tap to read letter
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Opened Letter State */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="w-full bg-cream shadow-2xl relative"
              initial={{ opacity: 0, y: 120, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.85, type: "spring", bounce: 0.35 }}
              onAnimationComplete={() => {
                if (phase === 'paper-rising') {
                  setTimeout(() => setPhase('typing'), 250);
                }
              }}
              style={{
                borderRadius: '3px',
                border: '1px solid rgba(59, 10, 18, 0.1)',
                padding: '10px'
              }}
            >
              {/* Inner dashed border simulating torn paper edge overlay */}
              <div className="w-full min-h-[460px] border-2 border-dashed border-burgundy/20 p-8 md:p-12 bg-white/50 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between">
                
                {/* Paper texture overlay */}
                <img src="/stickers/letter_paper.webp" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-20 pointer-events-none" />

                {/* Flower Branch Framing (Bottom Left) */}
                <motion.img 
                  src="/stickers/flower_branch_2.webp" 
                  alt="Flower Branch"
                  className="absolute -bottom-10 -left-10 md:-bottom-16 md:-left-16 w-56 md:w-72 z-0 opacity-80 mix-blend-multiply pointer-events-none"
                  initial={{ rotate: -15 }}
                  animate={{ rotate: [-15, -14, -16, -15] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />

                {/* Top Header: Date & Skip Button */}
                <div className="flex items-center justify-between relative z-10 mb-6">
                  <motion.p 
                    className="font-mono text-accent text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'paper-rising' ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {DATA.date}
                  </motion.p>

                  {/* Skip Typewriter Button */}
                  {phase === 'typing' && (
                    <motion.button
                      onClick={handleSkip}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-burgundy/10 hover:bg-burgundy hover:text-cream text-burgundy font-mono text-[11px] rounded-xs border border-burgundy/30 transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Skip typewriter animation"
                    >
                      <span>Skip</span>
                      <span>▸▸</span>
                    </motion.button>
                  )}
                </div>
                
                {/* Main Body: Typewriter Content */}
                <div className="font-mono text-burgundy text-base md:text-lg leading-loose whitespace-pre-wrap relative z-10 min-h-[220px]">
                  {displayedText}
                  {/* Blinking Cursor during typing */}
                  {phase === 'typing' && (
                    <span className="inline-block w-2 h-4.5 bg-accent ml-1 animate-pulse align-middle" />
                  )}
                </div>
                
                {/* Bottom Footer: Signature & Actions */}
                <motion.div 
                  className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-burgundy/10 pt-8 relative z-10"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ 
                    opacity: phase === 'done' ? 1 : 0, 
                    y: phase === 'done' ? 0 : 15 
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-script text-3xl text-burgundy">
                    Forever Favourite
                  </p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={copyLetter} 
                      className="px-4 py-2 border border-burgundy text-burgundy font-mono text-xs hover:bg-burgundy hover:text-cream transition-colors cursor-pointer"
                    >
                      COPY MESSAGE
                    </button>
                    <button 
                      onClick={handleReseal} 
                      className="px-4 py-2 bg-burgundy text-cream font-mono text-xs hover:bg-accent transition-colors cursor-pointer"
                    >
                      RE-SEAL
                    </button>
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </section>
  );
}
