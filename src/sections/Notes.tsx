import { DATA } from '../utils/constants';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { sfx } from '../utils/sfx';
import ay7 from '../assets/images/ay-7.webp';
import ay4 from '../assets/images/ay-4.webp';
import ay5 from '../assets/images/ay-5.webp';

interface NoteItem {
  text: string;
  badge: string;
  bg: string;
  border: string;
  pinColor: string;
  photo: string;
  photoCaption: string;
  photoRotate: number;
}

const noteStyles: NoteItem[] = [
  {
    text: DATA.littleThings[0],
    badge: '#01 · CUTE HABIT',
    bg: 'bg-[#FFEBEF]',
    border: 'border-[#F8CAD3]',
    pinColor: 'from-[#D83A56] to-[#9B1D30]',
    photo: ay7,
    photoCaption: 'Your Smile ♡',
    photoRotate: -6,
  },
  {
    text: DATA.littleThings[1],
    badge: '#02 · SAFE SPACE',
    bg: 'bg-[#FFF8E7]',
    border: 'border-[#ECDDBB]',
    pinColor: 'from-[#D4AF37] to-[#997A15]',
    photo: ay4,
    photoCaption: 'Comfort Place',
    photoRotate: 7,
  },
  {
    text: DATA.littleThings[2],
    badge: '#03 · PURE SERENITY',
    bg: 'bg-[#FFF0E6]',
    border: 'border-[#F6D5C2]',
    pinColor: 'from-[#B0303C] to-[#5E0F1A]',
    photo: ay5,
    photoCaption: 'Special Melody',
    photoRotate: -5,
  },
];

export default function Notes() {
  const hasPlayedRef = useRef(false);

  const handleNoteTap = () => {
    sfx.play('paper-slide');
  };

  return (
    <section className="relative w-full py-28 md:py-36 overflow-hidden bg-[#FAF5EC]/60 border-y border-burgundy/10">
      {/* Full-bleed Antique Botanical Wallpaper Parallax Background */}
      <img
        src="/parallax/botanical_wallpaper.webp"
        alt="Botanical Wallpaper"
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none select-none z-0"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
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
          <p className="font-mono text-xs uppercase tracking-widest text-accent mb-2">
            ✦ Chapter 07 · Scrapbook Pinboard ✦
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl text-burgundy italic leading-tight">
            "The little things you do that make me smile"
          </h2>
          <p className="font-mono text-xs text-burgundy/60 mt-2 tracking-wider uppercase">
            Hal-hal kecil tentangmu yang selalu bikin bahagia
          </p>
        </motion.div>

        {/* Ambient Stickers */}
        <motion.img
          src="/stickers/leter3.webp"
          alt="Vintage Letter Note"
          className="hidden md:block absolute top-20 -left-12 w-32 z-0 drop-shadow-md pointer-events-none opacity-85 -rotate-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.85, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <motion.img
          src="/stickers/boquet3.webp"
          alt="Flower Bouquet"
          className="hidden md:block absolute bottom-12 -right-12 w-40 z-0 drop-shadow-lg pointer-events-none opacity-90 rotate-12"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 0.9, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Pinboard Grid / Stack */}
        <div className="flex flex-col gap-10 sm:gap-14 relative z-10 items-center">
          {noteStyles.map((item, idx) => {
            const isEven = idx % 2 === 0;
            const noteRotate = isEven ? -1.5 : 1.5;

            return (
              <motion.div
                key={idx}
                onClick={handleNoteTap}
                className="relative w-full max-w-2xl cursor-pointer group select-none"
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ type: 'spring', stiffness: 90, damping: 13, delay: idx * 0.2 }}
                whileHover={{ scale: 1.02, rotate: 0 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 1. Slipped Authentic Mini Polaroid Photo Beside Note */}
                <motion.div
                  className={`absolute -top-6 ${
                    isEven ? '-right-2 sm:-right-8' : '-left-2 sm:-left-8'
                  } w-24 sm:w-32 bg-white p-2 pb-5 shadow-xl rounded-xs border border-black/10 z-20 pointer-events-none`}
                  initial={{ rotate: item.photoRotate }}
                  animate={{ rotate: [item.photoRotate, item.photoRotate + (isEven ? 2 : -2), item.photoRotate] }}
                  transition={{ repeat: Infinity, duration: 5 + idx, ease: 'easeInOut' }}
                >
                  {/* Washi tape on top of mini photo */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-amber-100/80 border-b border-amber-200/50 rotate-1 shadow-xs" />

                  {/* Photo Thumbnail */}
                  <div className="w-full aspect-[4/5] bg-burgundy/10 rounded-2xs overflow-hidden border border-black/10">
                    <img src={item.photo} alt={item.photoCaption} className="w-full h-full object-cover" />
                  </div>

                  <p className="font-script text-[11px] sm:text-xs text-center text-burgundy font-semibold mt-1 leading-none">
                    {item.photoCaption}
                  </p>
                </motion.div>

                {/* 2. Main Sticky Memo Card */}
                <div
                  className={`${item.bg} p-6 sm:p-8 rounded-sm shadow-[0_12px_28px_rgba(0,0,0,0.08)] border-2 ${item.border} relative overflow-hidden flex flex-col justify-between min-h-[140px]`}
                  style={{ transform: `rotate(${noteRotate}deg)` }}
                >
                  {/* 3D Metallic Pushpin on Top */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.pinColor} shadow-md border border-white/60`}
                    />
                    <div className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-black/30 blur-[0.5px]" />
                  </div>

                  {/* Top Badge */}
                  <div className="flex items-center justify-between border-b border-black/10 pb-2 mb-3">
                    <span className="font-mono text-[10px] text-accent tracking-widest font-bold">
                      {item.badge}
                    </span>
                    <span className="font-mono text-[9px] text-burgundy/40 uppercase">
                      Memory Note
                    </span>
                  </div>

                  {/* Memo Handwritten Content */}
                  <p className="font-script text-2xl sm:text-3xl text-burgundy/95 text-center leading-relaxed my-2 px-4 sm:px-12 font-medium">
                    "{item.text}"
                  </p>

                  {/* Bottom Footer Details */}
                  <div className="flex items-center justify-between pt-2 border-t border-black/5 mt-3 text-[10px] font-mono text-burgundy/50">
                    <span>Forever Loved</span>
                    <span className="flex items-center gap-1 text-accent font-bold">
                      <span>✓</span>
                      <span>Verified Truth</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
