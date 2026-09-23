import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sfx } from '../utils/sfx';
import defaultPhoto from '../assets/images/ayud-2.webp';

export default function CanvasPolaroid({ rotation, delay, imgSrc }: { rotation: number, delay: number, imgSrc?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load authentic image
    const img = new Image();
    img.src = imgSrc || defaultPhoto;
    
    let animationFrameId: number | null = null;
    let isVisible = false;
    let time = 0;

    const render = () => {
      if (!isVisible) return;
      time += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const slices = 24; // Optimized slice count for 60fps mobile GPU
      const sliceWidth = width / slices;

      for (let i = 0; i < slices; i++) {
        const x = i * sliceWidth;
        // Smooth sine wave offset
        const yOffset = Math.sin(time + i * 0.22) * 6;
        
        ctx.drawImage(
          img,
          x * (img.width / width), 0, sliceWidth * (img.width / width), img.height,
          x, yOffset, sliceWidth, height
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    img.onload = () => {
      if (isVisible) {
        render();
      }
    };

    // IntersectionObserver to pause loop when offscreen (saves mobile CPU & battery)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (img.complete) {
            render();
          }
        } else if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [imgSrc]);

  return (
    <motion.div
      ref={containerRef}
      onClick={() => sfx.play('click')}
      className="bg-[#f8f8f8] p-3 pb-10 md:p-4 md:pb-12 shadow-lg w-48 md:w-64 cursor-pointer relative"
      initial={{ y: -100, opacity: 0, rotate: rotation * 2 }}
      whileInView={{ y: 0, opacity: 1, rotate: rotation }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 12, 
        delay: delay 
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0, 
        zIndex: 20, 
        boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-full aspect-square bg-[#222] mb-3 overflow-hidden flex items-center justify-center relative">
         <canvas 
           ref={canvasRef} 
           width={300} 
           height={300} 
           className="w-full h-full object-cover"
         />
      </div>
      <p className="font-script text-xl md:text-2xl text-center text-burgundy">
        Our best memories
      </p>
      
      {/* Tape decoration */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm shadow-sm"
        style={{ transform: `translateX(-50%) rotate(${rotation > 0 ? -3 : 3}deg)` }}
      />
    </motion.div>
  );
}
