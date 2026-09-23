import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Sparkles, Gift, RotateCcw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DATA } from '../utils/constants';
import { sfx } from '../utils/sfx';
import ayudPhoto from '../assets/images/ayud1.webp';

export default function Words() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15%' });
  const hasPlayedWhooshRef = useRef(false);

  const [isFlipped, setIsFlipped] = useState(false);

  // Sound effect on section scroll into view
  useEffect(() => {
    if (isInView && !hasPlayedWhooshRef.current) {
      sfx.play('whoosh');
      hasPlayedWhooshRef.current = true;
    }
  }, [isInView]);

  // 3D Mouse Parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for buttery smooth tilt
  const springX = useSpring(mouseX, { stiffness: 160, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 160, damping: 18 });

  // Tilt transforms
  const rotateX = useTransform(springY, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-16deg', '16deg']);

  // Floating parallax stickers offsets
  const sticker1X = useTransform(springX, [-0.5, 0.5], [-24, 24]);
  const sticker1Y = useTransform(springY, [-0.5, 0.5], [-18, 18]);
  const sticker2X = useTransform(springX, [-0.5, 0.5], [28, -28]);
  const sticker2Y = useTransform(springY, [-0.5, 0.5], [22, -22]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / heightCalc(rect.height) - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const heightCalc = (h: number) => (h > 0 ? h : 1);

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleOpenGift = () => {
    sfx.play('flip');
    setIsFlipped(true);

    // Confetti burst on card open
    setTimeout(() => {
      sfx.play('pop');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.25, y: 0.55 },
        colors: ['#9B1D30', '#D4AF37', '#FFF5E1', '#E8B4B8'],
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.75, y: 0.55 },
        colors: ['#9B1D30', '#D4AF37', '#FFF5E1', '#E8B4B8'],
      });
    }, 200);
  };

  const handleCloseGift = () => {
    sfx.play('flip');
    setIsFlipped(false);
  };

  const giftDetails = [
    {
      num: '01',
      title: 'Parfum',
      desc: 'Wewangian spesial yang bakal selalu menemani harimu dan mengingatkanmu sama momen indah kita.',
      tag: 'Special Scent',
      icon: '✨',
    },
    {
      num: '02',
      title: 'Hadiah Kedua',
      desc: 'Kejutan istimewa berikutnya yang sudah disiapkan dengan penuh kasih di hari ulang tahunmu.',
      tag: 'Surprise Gift',
      icon: '🎁',
    },
    {
      num: '03',
      title: 'Hadiah Ketiga',
      desc: 'Kado manis penutup yang melengkapi kebahagiaanmu di umur yang ke-18 ini.',
      tag: 'Cherished Item',
      icon: '💝',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen py-24 md:py-32 bg-[#2d050c] text-cream flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(176,48,60,0.3)_0%,_transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(212,175,55,0.15)_0%,_transparent_50%)] pointer-events-none" />

      {/* Full-bleed Watercolor Floral Parallax Background */}
      <motion.img
        src="/parallax/floral_watercolor.webp"
        alt="Floral Watercolor Background"
        style={{ x: sticker2X, y: sticker1Y }}
        className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen pointer-events-none select-none z-0"
      />

      {/* Floating Parallax Sticker 1: Birthday Cake (Top Left) */}
      <motion.div
        style={{ x: sticker1X, y: sticker1Y }}
        className="absolute top-12 left-4 sm:left-12 md:left-24 w-28 sm:w-36 md:w-44 z-20 pointer-events-none select-none"
        initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/stickers/birthday_cake.webp"
          alt="Birthday Cake"
          className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          animate={{ y: [0, -8, 0], rotate: [-8, -6, -8] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating Parallax Sticker: Cute Teddy Doll (Bottom Left) */}
      <motion.div
        style={{ x: sticker1X, y: sticker2Y }}
        className="absolute bottom-12 left-4 sm:left-14 md:left-20 w-28 sm:w-36 md:w-44 z-20 pointer-events-none select-none"
        initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.15 }}
      >
        <motion.img
          src="/stickers/boneka.webp"
          alt="Teddy Bear"
          className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          animate={{ y: [0, -6, 0], rotate: [-6, -4, -6] }}
          transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating Parallax Sticker: Flower Bouquet 2 (Top Right) */}
      <motion.div
        style={{ x: sticker2X, y: sticker1Y }}
        className="absolute top-16 right-4 sm:right-14 md:right-24 w-28 sm:w-36 md:w-44 z-20 pointer-events-none select-none"
        initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 10 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.img
          src="/stickers/boquet2.webp"
          alt="Flower Bouquet"
          className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          animate={{ y: [0, -8, 0], rotate: [10, 12, 10] }}
          transition={{ repeat: Infinity, duration: 4.4, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating Parallax Sticker 2: Rose Bouquet (Bottom Right) */}
      <motion.div
        style={{ x: sticker2X, y: sticker2Y }}
        className="absolute bottom-10 right-4 sm:right-12 md:right-24 w-32 sm:w-40 md:w-52 z-20 pointer-events-none select-none"
        initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 12 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <motion.img
          src="/stickers/rose_bouquet.webp"
          alt="Rose Bouquet"
          className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]"
          animate={{ y: [0, -10, 0], rotate: [12, 14, 12] }}
          transition={{ repeat: Infinity, duration: 4.6, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Floating Sticker: Butterfly Flutter (Center-Right) */}
      <motion.img
        src="/stickers/kupu-kupu.webp"
        alt="Butterfly"
        className="absolute top-1/3 right-8 md:right-32 w-16 md:w-20 drop-shadow-lg z-25 pointer-events-none select-none"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, -7, 0], rotate: [-4, 6, -4] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
      />

      {/* Floating Sticker: Party Hat (Center-Left) */}
      <motion.img
        src="/stickers/topi.webp"
        alt="Party Hat"
        className="absolute top-1/3 left-6 md:left-28 w-20 md:w-24 drop-shadow-xl z-25 pointer-events-none select-none -rotate-12"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        animate={{ y: [0, -5, 0], rotate: [-12, -8, -12] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />

      {/* Section Header */}
      <motion.div
        className="text-center mb-10 px-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/10 border border-cream/20 mb-3 backdrop-blur-xs">
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          <span className="font-mono text-[11px] tracking-widest text-cream uppercase">
            Special Birthday Gift
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-cream italic leading-tight">
          A Gift For The Birthday Girl
        </h2>
        <p className="font-mono text-cream/70 text-xs sm:text-sm max-w-md mx-auto mt-2">
          Gerakkan kursor untuk efek 3D parallax, lalu klik untuk membuka hadiah spesialmu.
        </p>
      </motion.div>

      {/* 3D PARALLAX CARD WRAPPER */}
      <div
        className="relative w-full max-w-4xl px-4 flex items-center justify-center z-10"
        style={{ perspective: 1400 }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: isFlipped ? 0 : rotateX,
            rotateY: isFlipped ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full max-w-3xl min-h-[520px] transition-shadow duration-300 cursor-pointer transform-gpu"
        >
          {/* Card Inner with 3D Flip */}
          <motion.div
            className="w-full h-full relative transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.85, type: 'spring', stiffness: 85, damping: 14 }}
          >
            {/* ============================================================== */}
            {/* FRONT FACE: LUXURY BIRTHDAY GIFT BOX                           */}
            {/* ============================================================== */}
            <div
              onClick={handleOpenGift}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: '1.25rem',
              }}
              className="w-full min-h-[520px] bg-gradient-to-br from-[#4d0c16] via-[#65101d] to-[#3a070e] p-8 sm:p-12 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-2 border-amber-300/30 flex flex-col items-center justify-between relative overflow-hidden select-none group"
            >
              {/* Foil Shimmer Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity" />

              {/* Decorative Vintage Inlay Border */}
              <div className="absolute inset-3 border border-dashed border-amber-200/25 rounded-xl pointer-events-none" />

              {/* Luxury Satin Gold Ribbon: Vertical */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-r from-amber-300 via-amber-100 to-amber-400 shadow-xl border-x border-amber-500/40 pointer-events-none z-0">
                <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_8px,_rgba(0,0,0,0.2)_8px,_rgba(0,0,0,0.2)_16px)]" />
              </div>

              {/* Luxury Satin Gold Ribbon: Horizontal */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 bg-gradient-to-b from-amber-300 via-amber-100 to-amber-400 shadow-xl border-y border-amber-500/40 pointer-events-none z-0">
                <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(-45deg,_transparent,_transparent_8px,_rgba(0,0,0,0.2)_8px,_rgba(0,0,0,0.2)_16px)]" />
              </div>

              {/* Top Tag: Header */}
              <div className="relative z-10 w-full flex items-center justify-between">
                <div className="px-3 py-1 bg-black/40 backdrop-blur-xs rounded-sm border border-amber-300/30">
                  <span className="font-mono text-[10px] text-amber-200 tracking-widest uppercase">
                    SPECIAL EDITION · 18TH BIRTHDAY
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-200/80">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* CENTERPIECE: WAX SEAL & GIFT BADGE */}
              <div className="relative z-10 flex flex-col items-center text-center my-6">
                {/* 3D Wax Seal */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 rounded-full bg-black/30 blur-md" />
                  <img
                    src="/stickers/wax_seal.webp"
                    alt="Wax Seal"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-[#fff5e1] absolute drop-shadow-md" fill="#FFF5E1" />
                </div>

                {/* Gift Tag Card attached with ribbon */}
                <div className="bg-[#FFF5E1] text-burgundy px-6 py-4 rounded-sm shadow-2xl border border-amber-400/50 max-w-sm rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-burgundy/60 mb-0.5">
                    PARCEL TO
                  </p>
                  <h3 className="font-script text-2xl sm:text-3xl text-burgundy leading-tight">
                    {DATA.receiver.split(' ')[0]} ♡
                  </h3>
                  <p className="font-mono text-[10px] text-burgundy/80 mt-1">
                    Tap to unwrap your special gift
                  </p>
                </div>
              </div>

              {/* BOTTOM INTERACTIVE CTA */}
              <div className="relative z-10 w-full flex flex-col items-center">
                <button
                  type="button"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-burgundy font-mono text-xs tracking-wider uppercase font-bold shadow-[0_10px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Buka Hadiah Ulang Tahun 🎁</span>
                </button>
                <span className="font-mono text-[10px] text-cream/60 mt-2 tracking-widest uppercase">
                  ✦ Click anywhere to open ✦
                </span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* BACK FACE: INSIDE THE GIFT (PHOTO PLACEHOLDER + 3 WORDS)       */}
            {/* ============================================================== */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderRadius: '1.25rem',
              }}
              className="absolute inset-0 w-full h-full bg-[#FFF8EC] text-burgundy p-5 sm:p-7 md:p-9 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-2 border-burgundy/20 flex flex-col justify-between overflow-y-auto no-scrollbar select-none"
            >
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(128,0,32,0.03)_0%,_transparent_70%)] pointer-events-none" />
              <div className="absolute inset-3 border border-dashed border-burgundy/20 rounded-xl pointer-events-none" />

              {/* Card Top Nav inside */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-burgundy/15 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="font-mono text-xs tracking-widest uppercase text-accent font-semibold">
                    Happy {DATA.age}th Birthday, {DATA.receiver.split(' ')[0]}!
                  </span>
                </div>
                <button
                  onClick={handleCloseGift}
                  className="px-3 py-1 rounded-sm bg-burgundy/10 hover:bg-burgundy hover:text-cream text-burgundy font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Tutup Hadiah"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tutup ↺</span>
                </button>
              </div>

              {/* DUAL COLUMN MAIN CONTENT: PHOTO AYUDYA + 3 BIRTHDAY GIFTS */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1">
                {/* LEFT: POLAROID PHOTO AYUDYA (md:col-span-5) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center">
                  <div className="bg-white p-3 pb-6 shadow-xl rounded-sm border border-black/10 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 max-w-[240px] sm:max-w-[260px] w-full relative">
                    {/* Washi tape on top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/80 border-b border-amber-200/50 rotate-1 shadow-xs" />

                    {/* Actual Ayudya Photo */}
                    <div className="w-full aspect-[4/5] bg-burgundy/10 rounded-xs overflow-hidden relative shadow-inner group">
                      <img 
                        src={ayudPhoto} 
                        alt={DATA.receiver} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>

                    {/* Polaroid Bottom Caption */}
                    <p className="font-script text-2xl text-center text-burgundy mt-3 font-semibold">
                      {DATA.receiver.split(' ')[0]} Hanun ♡
                    </p>
                    <p className="font-mono text-[9px] text-center text-burgundy/60 tracking-widest uppercase mt-0.5">
                      The Birthday Girl · 18
                    </p>
                  </div>
                </div>

                {/* RIGHT: THE 3 BIRTHDAY GIFTS (md:col-span-7) */}
                <div className="md:col-span-7 flex flex-col justify-center gap-3">
                  <div className="mb-1">
                    <p className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">
                      ✦ 3 SPECIAL GIFTS FOR YOU ✦
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-burgundy italic">
                      Kado Ulang Tahunmu
                    </h3>
                  </div>

                  {/* 3 Interactive Gift Cards */}
                  <div className="flex flex-col gap-2.5">
                    {giftDetails.map((item, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-white/80 hover:bg-white p-3 sm:p-3.5 rounded-lg border border-burgundy/15 shadow-xs transition-all hover:shadow-md hover:border-accent/40 group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + idx * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-burgundy/10 text-burgundy font-mono text-[10px] flex items-center justify-center font-bold">
                              {item.num}
                            </span>
                            <span className="font-serif text-xl sm:text-2xl text-burgundy font-medium leading-none flex items-center gap-1.5">
                              <span>{item.title}</span>
                              <span className="text-base">{item.icon}</span>
                            </span>
                          </div>
                          <span className="font-mono text-[9px] text-accent uppercase tracking-wider px-2 py-0.5 bg-burgundy/5 rounded-full">
                            {item.tag}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] sm:text-xs text-burgundy/80 leading-relaxed pl-8">
                          {item.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sweet Footer Note */}
                  <div className="mt-2 p-2.5 rounded-lg bg-burgundy/5 border border-dashed border-burgundy/20 flex items-center justify-between">
                    <p className="font-script text-lg text-burgundy">
                      From {DATA.sender} with all my love
                    </p>
                    <span className="font-mono text-[9px] text-burgundy/60 uppercase">
                      28 Jan 2027
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="relative z-10 pt-3 border-t border-burgundy/15 flex items-center justify-between mt-3 text-burgundy/60 font-mono text-[10px]">
                <span>Tap "Tutup" to re-wrap gift</span>
                <span className="tracking-widest uppercase">Ayudya Hanun · 18</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
