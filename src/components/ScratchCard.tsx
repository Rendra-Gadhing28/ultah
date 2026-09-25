import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, Heart } from 'lucide-react';
import { DATA } from '../utils/constants';
import { sfx } from '../utils/sfx';
import giftPhoto1 from '../assets/images/ay-4.webp';
import giftPhoto2 from '../assets/images/ay-5.webp';
import giftPhoto3 from '../assets/images/ay-7.webp';

interface GiftTicket {
  id: number;
  tag: string;
  name: string;
  desc: string;
  photo: string;
  icon: string;
  color: string;
}

const giftTickets: GiftTicket[] = [
  {
    id: 0,
    tag: 'HADIAH #01 · SPECIAL SCENT',
    name: 'Parfum Spesial',
    desc: 'Wewangian manis pilihan terbaik yang bakal selalu menemani harimu dan mengingatkanmu sama momen indah kita ♡',
    photo: giftPhoto1,
    icon: '✨',
    color: 'from-rose-900 to-amber-950',
  },
  {
    id: 1,
    tag: 'HADIAH #02 · SURPRISE GIFT',
    name: 'Kejutan Kado Kedua',
    desc: 'Hadiah istimewa berikutnya yang sudah disiapkan dengan penuh kasih di hari ulang tahunmu yang ke-18 ✨',
    photo: giftPhoto2,
    icon: '🎁',
    color: 'from-amber-950 to-rose-950',
  },
  {
    id: 2,
    tag: 'HADIAH #03 · CHERISHED ITEM',
    name: 'Kado Spesial Ketiga',
    desc: 'Kado manis penutup pelengkap kebahagiaanmu di umur 18 tahun ini, spesial dari Rendra 💖',
    photo: giftPhoto3,
    icon: '💝',
    color: 'from-burgundy to-black',
  },
];

export default function ScratchCard() {
  const [activeTab, setActiveTab] = useState(0);
  const [revealedStates, setRevealedStates] = useState<boolean[]>([false, false, false]);
  const [scratchPcts, setScratchPcts] = useState<number[]>([0, 0, 0]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize metallic gold scratch foil for active canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealedStates[activeTab]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Metallic Gold Foil Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#D4AF37');
    gradient.addColorStop(0.25, '#FFF6C2');
    gradient.addColorStop(0.5, '#AA820A');
    gradient.addColorStop(0.75, '#F3E5AB');
    gradient.addColorStop(1, '#9B1D30');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Dashed Decorative Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(10, 10, width - 20, height - 20);
    ctx.setLineDash([]);

    // Typography on scratch foil
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4A0E17';
    ctx.font = 'bold 12px "Courier Prime", monospace';
    ctx.fillText(`✦ KUPON HADIAH ${activeTab + 1} OF 3 ✦`, width / 2, height / 2 - 18);

    ctx.fillStyle = '#3B0A12';
    ctx.font = 'bold 16px "Caveat", cursive';
    ctx.fillText('✨ Usap jarimu di sini untuk membuka ✨', width / 2, height / 2 + 10);

    ctx.font = '10px "Courier Prime", monospace';
    ctx.fillStyle = '#5E0F1A';
    ctx.fillText('(Touch & scratch to reveal)', width / 2, height / 2 + 32);
  }, [activeTab, revealedStates]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  // Check scratch progress
  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealedStates[activeTab]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let cleared = 0;
      const total = data.length / 4;

      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) cleared += 4;
      }

      const pct = Math.min(100, Math.round((cleared / total) * 100));
      setScratchPcts((prev) => {
        const next = [...prev];
        next[activeTab] = pct;
        return next;
      });

      if (pct >= 40 && !revealedStates[activeTab]) {
        setRevealedStates((prev) => {
          const next = [...prev];
          next[activeTab] = true;
          return next;
        });
        sfx.play('pop');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#D4AF37', '#9B1D30', '#FFF5E1', '#E8B4B8'],
        });
      }
    } catch {
      // Fallback safety
    }
  }, [activeTab, revealedStates]);

  // Coordinates Mapping
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  // Continuous line scratching for 100% fluid mobile gesture without dotted gaps
  const scratchLine = (fromX: number, fromY: number, toX: number, toY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedStates[activeTab]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 48; // Comfortable touch finger thickness
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(toX, toY, 24, 0, Math.PI * 2);
    ctx.fill();

    checkProgress();
  };

  // UNIFIED POINTER EVENT HANDLERS (Full Mobile Touch & Mouse Support)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const pos = getCanvasCoords(e.clientX, e.clientY);
    lastPosRef.current = pos;
    scratchLine(pos.x, pos.y, pos.x, pos.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const pos = getCanvasCoords(e.clientX, e.clientY);
    if (lastPosRef.current) {
      scratchLine(lastPosRef.current.x, lastPosRef.current.y, pos.x, pos.y);
    } else {
      scratchLine(pos.x, pos.y, pos.x, pos.y);
    }
    lastPosRef.current = pos;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe capture release
      }
    }
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  // Direct reply to Rendra's WhatsApp with exact requested message
  const handleClaimAllGifts = () => {
    sfx.play('click');
    const message = 'terimakasihh jabrik aku suka semua hadiahnya, hadiahnya aku terima yaaa, lucuuu dehh.';
    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${DATA.phone}&text=${encoded}`, '_blank');
  };

  const allRevealed = revealedStates.every(Boolean);
  const anyRevealed = revealedStates.some(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto my-14 px-4 select-none">
      {/* Container Frame */}
      <div className="bg-gradient-to-br from-[#2D050A] via-[#4A0E17] to-[#1F0307] p-5 sm:p-7 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-2 border-amber-400/40 relative overflow-hidden">
        {/* Header Tag */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-amber-400/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-300" />
            <span className="font-mono text-xs sm:text-sm text-amber-200 tracking-widest uppercase font-bold">
              Kupon Kado Ulang Tahun (3 Hadiah)
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-mono text-[10px] text-cream/80 uppercase tracking-wider">
              {allRevealed
                ? 'Semua Kado Terbuka ✨'
                : `Kado ${activeTab + 1}: ${revealedStates[activeTab] ? '100% Terbuka' : `${scratchPcts[activeTab]}% Digosok`}`}
            </span>
          </div>
        </div>

        {/* 3 Gift Ticket Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {giftTickets.map((ticket, idx) => {
            const isTabActive = activeTab === idx;
            const isCardRevealed = revealedStates[idx];

            return (
              <button
                key={ticket.id}
                onClick={() => {
                  sfx.play('click');
                  setActiveTab(idx);
                }}
                className={`py-2 px-2 sm:px-3 rounded-xl font-mono text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                  isTabActive
                    ? 'bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-[#4A0E17] font-bold shadow-md border-amber-300 scale-102'
                    : 'bg-black/30 text-cream/70 hover:bg-black/50 hover:text-cream border-white/10'
                }`}
              >
                <span>{isCardRevealed ? '✓' : `0${idx + 1}`}</span>
                <span className="truncate">{ticket.name.split(' ')[0]}</span>
                {isCardRevealed && <span className="text-[11px]">🎁</span>}
              </button>
            );
          })}
        </div>

        {/* ACTIVE SCRATCH CARD BOX */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[220px] sm:min-h-[250px] rounded-2xl overflow-hidden border border-amber-300/30 shadow-2xl bg-[#FFF8EC] text-burgundy flex items-center justify-center">
          {/* UNDERLYING GIFT ITEM CARD (Revealed on scratch) */}
          <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-between items-center text-center">
            {/* Dashed Border Overlay */}
            <div className="absolute inset-2 border-2 border-dashed border-[#9B1D30]/25 rounded-xl pointer-events-none" />

            {/* Top Badge */}
            <div className="relative z-10 w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-accent uppercase tracking-widest border-b border-burgundy/10 pb-1.5">
              <span>{giftTickets[activeTab].tag}</span>
              <span className="font-bold text-amber-700">★ SPECIAL BIRTHDAY GIFT ★</span>
            </div>

            {/* Middle: Gift Photo + Details (Using object-contain so photo is never squashed) */}
            <div className="relative z-10 my-auto flex items-center justify-center gap-4 sm:gap-6 w-full max-w-lg px-2">
              {/* Photo of the Gift Item (Clean square container with object-contain) */}
              <div className="w-20 sm:w-28 md:w-32 aspect-square rounded-xl overflow-hidden bg-[#1f0407] border-2 border-amber-400/50 shadow-md shrink-0 flex items-center justify-center">
                <img
                  src={giftTickets[activeTab].photo}
                  alt={giftTickets[activeTab].name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Gift Item Description */}
              <div className="text-left flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#5E0F1A] leading-tight">
                    {giftTickets[activeTab].name}
                  </h3>
                  <span className="text-base">{giftTickets[activeTab].icon}</span>
                </div>
                <p className="font-script text-sm sm:text-base text-burgundy/85 leading-relaxed">
                  "{giftTickets[activeTab].desc}"
                </p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100/80 border border-amber-300 text-[9px] font-mono text-amber-900 font-bold uppercase">
                  <span>✓ 100% Untuk Ayudya</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-burgundy/60 border-t border-burgundy/10 pt-1.5">
              <span>Status: Siap Diterima ♡</span>
              <span>Dari: Rendra (Jabrik)</span>
            </div>
          </div>

          {/* OVERLYING CANVAS FOIL (Interactive Scratch Surface with Touch Action None & Pointer Events) */}
          <AnimatePresence>
            {!revealedStates[activeTab] && (
              <canvas
                key={`canvas-${activeTab}`}
                ref={canvasRef}
                width={520}
                height={300}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'none' }}
                className="absolute inset-0 w-full h-full cursor-crosshair touch-none select-none z-20"
              />
            )}
          </AnimatePresence>
        </div>

        {/* ACTION BUTTON (Appears when any/all gifts revealed to reply to Rendra) */}
        {anyRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex flex-col items-center text-center"
          >
            <button
              onClick={handleClaimAllGifts}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-[#3B0A12] font-mono text-xs sm:text-sm tracking-wider uppercase font-bold shadow-[0_10px_25px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_30px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-400"
            >
              <Heart className="w-4 h-4 text-rose-700" fill="currentColor" />
              <span>Kirim Pesan Terima Kasih ke WhatsApp Rendra 💬</span>
            </button>
            <p className="font-script text-sm sm:text-base text-amber-200/90 mt-2">
              "terimakasihh jabrik aku suka semua hadiahnya, hadiahnya aku terima yaaa, lucuuu dehh."
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
