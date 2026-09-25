import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCw, ZoomIn, ZoomOut, Move, Crop } from 'lucide-react';
import { sfx } from '../utils/sfx';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  frameIndex: number;
  onCropComplete: (croppedDataUrl: string, frameIndex: number) => void;
  onClose: () => void;
}

function CropDialogContent({
  imageSrc,
  frameIndex,
  onCropComplete,
  onClose,
}: {
  imageSrc: string;
  frameIndex: number;
  onCropComplete: (croppedDataUrl: string, frameIndex: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);

  // Touch & Mouse Drag Handlers
  const handlePointerDown = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    setPosition({
      x: clientX - dragStartRef.current.x,
      y: clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleRotate = () => {
    sfx.play('click');
    setRotation((prev) => (prev + 90) % 360);
  };

  // Generate 1:1 Cropped Image on Canvas
  const handleApplyCrop = useCallback(() => {
    if (!imageRef.current || !cropAreaRef.current) return;
    sfx.play('camera-shutter');

    const canvas = document.createElement('canvas');
    const outputSize = 800; // 800x800 high-resolution crop
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const cropBox = cropAreaRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Fill background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, outputSize, outputSize);

    // Save context state for transform
    ctx.save();
    ctx.translate(outputSize / 2, outputSize / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate scale factor from screen crop area to 800px output canvas
    const scaleFactor = outputSize / cropBox.width;

    // Center offset relative to crop box
    const drawX = (imgRect.left + imgRect.width / 2 - (cropBox.left + cropBox.width / 2)) * scaleFactor;
    const drawY = (imgRect.top + imgRect.height / 2 - (cropBox.top + cropBox.height / 2)) * scaleFactor;
    const drawW = imgRect.width * scaleFactor;
    const drawH = imgRect.height * scaleFactor;

    ctx.drawImage(img, -drawW / 2 + drawX, -drawH / 2 + drawY, drawW, drawH);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCropComplete(croppedDataUrl, frameIndex);
  }, [frameIndex, onCropComplete, rotation]);

  return (
    <motion.div
      className="w-full max-w-md bg-[#22070c] border-2 border-amber-400/40 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-cream relative"
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-amber-300" />
          <span className="font-mono text-xs text-amber-200 tracking-wider uppercase font-bold">
            Sesuaikan Foto Frame #{String(frameIndex + 1).padStart(2, '0')}
          </span>
        </div>
        <button
          onClick={() => {
            sfx.play('click');
            onClose();
          }}
          className="p-1 text-cream/60 hover:text-cream hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hint */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-cream/70 mb-2 px-1">
        <span className="flex items-center gap-1">
          <Move className="w-3 h-3 text-amber-300" />
          <span>Geser untuk atur posisi</span>
        </span>
        <span>1:1 Square Frame</span>
      </div>

      {/* 1:1 SQUARE CROP VIEWPORT */}
      <div
        ref={cropAreaRef}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={(e) => {
          if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={handlePointerUp}
        className="relative w-64 sm:w-72 aspect-square rounded-xl overflow-hidden bg-black/60 border-2 border-amber-300/80 shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
      >
        {/* Image with transforms */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Crop preview"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
          className="max-w-none w-full h-full object-cover pointer-events-none transition-transform duration-75"
        />

        {/* Grid 3x3 Overlay Guidelines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/20">
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div className="border-r border-b border-white/20" />
          <div />
        </div>
      </div>

      {/* INTERACTIVE CONTROLS (Zoom Slider & Rotate) */}
      <div className="w-full mt-5 flex flex-col gap-3">
        {/* Zoom Control */}
        <div className="flex items-center justify-between gap-3 bg-black/30 px-3 py-2 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.max(0.8, prev - 0.2))}
            className="p-1 text-cream/70 hover:text-cream cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min="0.8"
            max="3.0"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-amber-400 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => setZoom((prev) => Math.min(3.0, prev + 0.2))}
            className="p-1 text-cream/70 hover:text-cream cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="font-mono text-[10px] text-amber-200 w-10 text-right">
            {zoom.toFixed(1)}x
          </span>
        </div>

        {/* Action Buttons (Rotate & Apply) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRotate}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/15"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-300" />
            <span>Putar 90°</span>
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 text-[#3B0A12] font-mono text-xs tracking-wider uppercase font-bold shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400"
          >
            <Check className="w-4 h-4 text-[#3B0A12]" />
            <span>Terapkan</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ImageCropModal({
  isOpen,
  imageSrc,
  frameIndex,
  onCropComplete,
  onClose,
}: ImageCropModalProps) {
  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CropDialogContent
            key={`${imageSrc}-${frameIndex}`}
            imageSrc={imageSrc}
            frameIndex={frameIndex}
            onCropComplete={onCropComplete}
            onClose={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
