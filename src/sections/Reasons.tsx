import { DATA } from '../utils/constants';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Camera, Check, Loader2, Upload, RefreshCw } from 'lucide-react';
import { sfx } from '../utils/sfx';
import ImageCropModal from '../components/ImageCropModal';

function StripFrame({
  reason,
  index,
  currentImg,
  onTriggerCrop,
}: {
  reason: { id: number; title: string; text: string; img: string };
  index: number;
  currentImg: string;
  onTriggerCrop: (frameIndex: number) => void;
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
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Photo (Style A: Vintage Darkroom Reveal) */}
        <div
          className="absolute inset-0 bg-[#140507] rounded-xs overflow-hidden border border-black/25 shadow-inner flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <motion.img
            src={currentImg}
            alt={reason.title}
            className="w-full h-full object-contain filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-500"
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

          {/* Change / Crop Photo Button on Frame */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerCrop(index);
            }}
            className="absolute top-2.5 right-2.5 bg-black/75 hover:bg-[#5E0F1A] text-amber-200 px-2 py-0.5 rounded-xs border border-amber-300/40 text-[9px] font-mono tracking-wider uppercase transition-all flex items-center gap-1 shadow-md cursor-pointer z-20"
            title="Ganti / Crop foto frame ini"
          >
            <Camera className="w-3 h-3 text-amber-300" />
            <span>Ganti</span>
          </button>

          {/* Developing Indicator Badge */}
          {darkroomPhase === 'developing' && (
            <div className="absolute bottom-2.5 left-2.5 bg-black/75 px-1.5 py-0.5 rounded-xs border border-amber-400/50">
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerPlayedRef = useRef(false);

  // 3-Frame Reasons Data
  const displayedReasons = DATA.reasons.slice(0, 3);
  const defaultImages = [DATA.reasons[0].img, DATA.reasons[1].img, DATA.reasons[2].img];

  // Client-side Custom Cropped Photos state (3 frames)
  const [photos, setPhotos] = useState<string[]>(defaultImages);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isPrinting, setIsPrinting] = useState(false);

  // Crop Modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedFileSrc, setSelectedFileSrc] = useState<string | null>(null);
  const [activeFrameForCrop, setActiveFrameForCrop] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax offsets tailored for sticker elements
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

  // Open file picker for a specific frame index
  const handleTriggerCrop = (frameIndex: number) => {
    sfx.play('click');
    setActiveFrameForCrop(frameIndex);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handle file selected from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFileSrc(reader.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Crop completed from modal
  const handleCropComplete = (croppedDataUrl: string, frameIdx: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[frameIdx] = croppedDataUrl;
      return next;
    });
    setCropModalOpen(false);
    setSelectedFileSrc(null);

    // Trigger Camera Ejection Printing Animation
    setIsPrinting(true);
    sfx.play('camera-shutter');
    setTimeout(() => {
      setIsPrinting(false);
    }, 1200);
  };

  // Reset to original default photos
  const handleResetPhotos = () => {
    sfx.play('click');
    setPhotos(defaultImages);
  };

  // Native High-DPI Canvas Generator (Super-sharp 300 DPI 3-Frame Photobooth Export)
  const handleDownloadPhotostrip = useCallback(async () => {
    if (downloadStatus === 'loading') return;
    setDownloadStatus('loading');
    sfx.play('click');

    try {
      const canvas = document.createElement('canvas');
      const width = 900;
      const padding = 45;
      const frameGap = 35;
      const photoWidth = width - padding * 2;
      const photoHeight = photoWidth; // 1:1 square photo aspect
      const topMargin = 60;
      const bottomHeight = 320;
      const totalHeight = topMargin + 3 * photoHeight + 2 * frameGap + bottomHeight;

      canvas.width = width;
      canvas.height = totalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      // 1. Photobooth Paper Background
      ctx.fillStyle = '#FAF8F5';
      ctx.fillRect(0, 0, width, totalHeight);

      // Subtle Outer Paper Border
      ctx.strokeStyle = '#E2D8C3';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, totalHeight - 4);

      // Top Ejection Slot
      ctx.fillStyle = 'rgba(26, 26, 26, 0.15)';
      ctx.beginPath();
      ctx.roundRect(padding, 25, photoWidth, 8, 4);
      ctx.fill();

      // 2. Load all 3 photos (custom or default) in parallel
      const loadImg = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const loadedImages = await Promise.all(photos.map((src) => loadImg(src)));

      // 3. Render Each 1:1 Photo Frame
      loadedImages.forEach((img, i) => {
        const y = topMargin + i * (photoHeight + frameGap);

        // Frame Shadow / Border
        ctx.fillStyle = '#140507';
        ctx.fillRect(padding - 4, y - 4, photoWidth + 8, photoHeight + 8);

        // Draw Image with center-crop
        const imgAspect = img.width / img.height;
        let sX = 0,
          sY = 0,
          sW = img.width,
          sH = img.height;
        if (imgAspect > 1) {
          sW = img.height;
          sX = (img.width - sW) / 2;
        } else {
          sH = img.width;
          sY = (img.height - sH) / 2;
        }

        ctx.drawImage(img, sX, sY, sW, sH, padding, y, photoWidth, photoHeight);

        // Top Left Frame Number Badge (#01 - #03)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.beginPath();
        ctx.roundRect(padding + 16, y + 16, 75, 36, 6);
        ctx.fill();

        ctx.fillStyle = '#FFF5E1';
        ctx.font = 'bold 20px "Courier Prime", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`#0${i + 1}`, padding + 53, y + 41);
      });

      // 4. Bottom Margin Typography
      const footerY = topMargin + 3 * (photoHeight + frameGap) + 30;

      // Divider Line
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, footerY);
      ctx.lineTo(width - padding, footerY);
      ctx.stroke();

      // Script Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#800020';
      ctx.font = 'bold 54px "Caveat", cursive';
      ctx.fillText("reasons why you're my favorite", width / 2, footerY + 75);

      // Monospace Metadata Line
      ctx.font = 'bold 22px "Courier Prime", monospace';
      ctx.fillStyle = 'rgba(128, 0, 32, 0.7)';
      ctx.fillText('N° 280127-18  •  28 · 01 · 2027  •  Ayudya & Rendra', width / 2, footerY + 135);

      // Sub-footer Tag
      ctx.fillStyle = '#9B1D30';
      ctx.font = 'bold 20px "Courier Prime", monospace';
      ctx.fillText('FOREVER FAVORITE PHOTOSTRIP', width / 2, footerY + 185);

      // 5. Trigger High-DPI Download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Blob generation failed');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'photostrip-ayudya-18th.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        sfx.play('camera-shutter');
        setDownloadStatus('success');
        setTimeout(() => setDownloadStatus('idle'), 3500);
      }, 'image/png', 1.0);
    } catch (err) {
      console.error('Failed to generate photostrip canvas:', err);
      setDownloadStatus('idle');
    }
  }, [downloadStatus, photos]);

  const hasCustomPhotos = photos.some((p, i) => p !== defaultImages[i]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 md:py-36 overflow-hidden border-y border-black/40"
      style={{
        backgroundColor: '#38070F',
        backgroundImage:
          'radial-gradient(circle at 50% 30%, rgba(185, 28, 48, 0.28) 0%, transparent 70%), radial-gradient(#1f0307 22%, transparent 23%)',
        backgroundSize: '100% 100%, 7px 7px',
      }}
    >
      {/* Hidden File Input for Device Image Selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Interactive 1:1 Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        imageSrc={selectedFileSrc}
        frameIndex={activeFrameForCrop}
        onCropComplete={handleCropComplete}
        onClose={() => {
          setCropModalOpen(false);
          setSelectedFileSrc(null);
        }}
      />

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
          <p className="font-mono text-xs uppercase tracking-widest text-amber-300/80 mb-2">
            ✦ Chapter 05 · Photobooth Strip ✦
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-cream italic leading-tight">
            "Reasons why you're my favorite"
          </h2>
          <p className="font-mono text-cream/70 text-xs sm:text-sm max-w-lg mx-auto mt-3">
            3 bingkai cerita kenangan kita. Kamu bisa mengganti & menyesuaikan foto di strip ini secara langsung.
          </p>
        </motion.div>

        {/* Central Photobooth Stage */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Parallax Scrapbook Stickers */}
          {/* Left Collage 1: Vintage Newspaper Clipping */}
          <motion.img
            src="/stickers/koran.webp"
            alt="Newspaper Clipping"
            style={{ y: yKoran, rotate: -8 }}
            className="absolute top-20 sm:top-28 -left-12 sm:-left-20 md:-left-28 w-32 sm:w-44 md:w-52 z-10 pointer-events-none select-none drop-shadow-xl opacity-90"
          />

          {/* Left Collage 2: Red Kiss Lipstick Mark */}
          <motion.div
            style={{ y: yKiss, rotate: -14 }}
            className="absolute top-[380px] sm:top-[440px] -left-6 sm:-left-12 z-30 pointer-events-none select-none"
          >
            <svg viewBox="0 0 100 65" className="w-16 sm:w-20 h-11 sm:h-14 drop-shadow-lg fill-[#c4142d]">
              <path
                d="M10,32 C20,15 35,12 48,22 C52,22 65,12 80,15 C92,18 95,28 92,34 C85,38 75,34 68,36 C58,38 52,44 48,44 C44,44 38,38 28,36 C21,34 15,38 10,32 Z M14,35 C22,48 35,58 48,58 C62,58 75,48 84,35 C75,44 62,48 48,48 C35,48 22,44 14,35 Z"
                opacity="0.95"
              />
            </svg>
          </motion.div>

          {/* Left Collage 3: Cassette Tape */}
          <motion.img
            src="/stickers/cassette.webp"
            alt="Cassette Tape"
            style={{ y: yCassette, rotate: -14 }}
            className="absolute top-[800px] sm:top-[920px] -left-16 sm:-left-24 md:-left-36 w-36 sm:w-44 md:w-52 z-25 drop-shadow-xl pointer-events-none select-none"
          />

          {/* Left Collage 4: Red Star Sticker */}
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

          {/* Right Collage 2: Vinyl Record */}
          <motion.div
            style={{ y: yVinyl }}
            className="absolute top-[420px] sm:top-[480px] -right-18 sm:-right-28 md:-right-36 w-48 sm:w-60 md:w-72 z-10 pointer-events-none"
          >
            <motion.img
              src="/stickers/vinyl.webp"
              alt="Vinyl Record"
              className="w-full h-full rounded-full drop-shadow-2xl"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            />
          </motion.div>

          {/* Right Collage 3: Mini Vintage Camera */}
          <motion.img
            src="/stickers/camera_leica.webp"
            alt="Mini Camera"
            style={{ y: yMiniCam, rotate: 12 }}
            className="absolute top-[520px] sm:top-[600px] right-2 sm:right-6 z-25 w-14 sm:w-18 drop-shadow-xl pointer-events-none select-none"
          />

          {/* Right Collage 4: Postage Stamp Lower-Right */}
          <motion.img
            src="/stickers/stamp.webp"
            alt="Postage Stamp"
            style={{ y: yStamp, rotate: 10 }}
            className="absolute top-[900px] sm:top-[1050px] -right-10 sm:-right-18 md:-right-24 w-28 sm:w-36 md:w-40 z-20 drop-shadow-lg pointer-events-none select-none"
          />

          {/* 1. Polaroid Camera on Top (With Print Ejection Reaction) */}
          <motion.div
            className="relative z-30 flex flex-col items-center"
            initial={{ y: -40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring' }}
            animate={isPrinting ? { y: [-6, 2, 0], scale: [1, 1.03, 1] } : {}}
          >
            <img
              src="/stickers/kamera.webp"
              alt="Polaroid OneStep 2"
              className="w-64 sm:w-76 md:w-84 drop-shadow-[0_22px_38px_rgba(0,0,0,0.85)] select-none pointer-events-none"
            />
          </motion.div>

          {/* 2. The 3-Frame Photobooth Strip (Ejected from camera slot) */}
          <motion.div
            className="relative z-20 -mt-8 sm:-mt-10 w-[280px] sm:w-[320px] md:w-[340px] bg-[#FAF8F5] p-3.5 sm:p-4 rounded-b-sm shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85)] border border-[#e2d8c3]"
            initial={{ scaleY: 0.95, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Top slot cutout look where the film emerged */}
            <div className="w-full h-1 bg-[#1a1a1a]/15 rounded-full mb-3" />

            {/* 3 Photo Frames Stacked Vertically */}
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {displayedReasons.map((reason, idx) => (
                <StripFrame
                  key={reason.id}
                  reason={reason}
                  index={idx}
                  currentImg={photos[idx]}
                  onTriggerCrop={handleTriggerCrop}
                />
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

          {/* ACTION BUTTONS: Upload, Reset & Save High-DPI Photobooth Strip (Lucide icons only) */}
          <motion.div
            className="relative z-30 mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* 1. Upload / Replace Photos Button */}
            <button
              onClick={() => handleTriggerCrop(0)}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#2A060C] hover:bg-[#4A0E17] text-cream border border-amber-300/30 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-mono text-xs tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
              title="Unggah dan sesuaikan foto kamu untuk dimasukkan ke photobooth strip"
            >
              <Upload className="w-4 h-4 text-amber-300" />
              <span>Unggah / Ganti Foto</span>
            </button>

            {/* 2. Save High-DPI Photobooth Strip Button */}
            <button
              onClick={handleDownloadPhotostrip}
              disabled={downloadStatus === 'loading'}
              className="w-full sm:w-auto px-5 py-3 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-[#3B0A12] border border-amber-400 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all font-mono text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              title="Unduh 3-frame photobooth strip berkualitas 300 DPI Ultra-HD"
            >
              {downloadStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#3B0A12]" />
                  <span>Memproses Strip HD...</span>
                </>
              ) : downloadStatus === 'success' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-800" />
                  <span>Foto Berhasil Disimpan</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#3B0A12]" />
                  <span>Simpan Strip Foto HD</span>
                </>
              )}
            </button>

            {/* 3. Reset Button (Only visible if photos have been customized) */}
            {hasCustomPhotos && (
              <button
                onClick={handleResetPhotos}
                className="w-full sm:w-auto px-4 py-3 rounded-full bg-black/40 hover:bg-black/60 text-cream/80 hover:text-cream border border-white/10 font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Kembalikan ke foto bawaan"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cream/70" />
                <span>Reset</span>
              </button>
            )}
          </motion.div>

          <span className="font-mono text-[9px] text-cream/50 uppercase tracking-widest mt-2 relative z-30">
            Kualitas Asli 300 DPI Ultra-HD · 100% Client-Side
          </span>

          {/* Bottom Collage: Airmail Letter with Red Rose */}
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
