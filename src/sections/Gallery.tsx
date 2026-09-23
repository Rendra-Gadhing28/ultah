import { DATA } from '../utils/constants';
import Polaroid from '../components/Polaroid';
import CanvasPolaroid from '../components/CanvasPolaroid';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { sfx } from '../utils/sfx';

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerPlayedRef = useRef(false);
  const cameraPlayedRef = useRef(false);
  
  // Parallax effect for the whole section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const y3 = useTransform(scrollYProgress, [0, 1], [120, -60]);
  const y4 = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const yCam = useTransform(scrollYProgress, [0, 1], [60, -100]);
  const yWallpaper = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-24 overflow-hidden">
      {/* Full-bleed Antique Botanical Wallpaper Parallax */}
      <motion.img
        src="/parallax/botanical_wallpaper.webp"
        alt="Botanical Wallpaper Background"
        style={{ y: yWallpaper }}
        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-multiply pointer-events-none select-none z-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.12 }}
        viewport={{ once: true }}
      />

      <div className="max-w-6xl mx-auto px-6">
        
        <motion.div 
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onAnimationStart={() => {
            if (!headerPlayedRef.current) {
              sfx.play('whoosh');
              headerPlayedRef.current = true;
            }
          }}
        >
          <p className="font-mono text-accent text-xs tracking-widest uppercase mb-2">Through My Lens</p>
          <h2 className="font-serif text-4xl md:text-5xl text-burgundy italic">
            "Favorite Moments"
          </h2>
        </motion.div>

        {/* Gallery Grid / Collage */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10">
          
          {/* Polaroid 1 */}
          <motion.div style={{ y: y1 }} className="z-10">
            <Polaroid 
              text={DATA.moments[0].text} 
              img={DATA.moments[0].img}
              rotation={-6} 
              delay={0.1} 
            />
          </motion.div>

          {/* Nikon Digicam Viewfinder with Ayudya's Photo Inside */}
          <motion.div 
            style={{ y: yCam }}
            className="z-25 relative my-4 lg:my-0"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04, rotate: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onAnimationStart={() => {
              if (!cameraPlayedRef.current) {
                setTimeout(() => sfx.play('camera-shutter'), 300);
                cameraPlayedRef.current = true;
              }
            }}
          >
            <div className="relative w-72 md:w-84 aspect-[599/417] drop-shadow-2xl">
              {/* Photo inside camera screen cutout */}
              <div className="absolute top-[18%] left-[8.5%] w-[59%] h-[64%] overflow-hidden rounded-sm bg-black">
                <img 
                  src={DATA.moments[1].img} 
                  alt="Through the camera screen" 
                  className="w-full h-full object-cover brightness-95 contrast-105"
                />
                {/* Vintage camcorder HUD overlay */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 bg-black/40 px-1.5 py-0.5 rounded">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-mono text-[9px] text-white font-bold tracking-widest">REC</span>
                </div>
                <div className="absolute bottom-1.5 right-2 z-10 bg-black/40 px-1.5 py-0.5 rounded">
                  <span className="font-mono text-[8px] text-white/90">28/01/2027</span>
                </div>
              </div>

              {/* Real Camera Frame webp on top */}
              <img 
                src="/stickers/frame-kamera.webp" 
                alt="Nikon Digicam" 
                className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
              />
            </div>
            
            <p className="font-script text-center text-xl text-burgundy mt-2">
              my favorite view
            </p>
          </motion.div>

          {/* Canvas Polaroid with Sine Wave motion */}
          <motion.div style={{ y: y2 }} className="z-20 relative">
            <CanvasPolaroid 
              rotation={4} 
              delay={0.3} 
              imgSrc={DATA.moments[2].img}
            />
            <motion.img 
              src="/stickers/butterfly.webp" 
              alt="Butterfly" 
              className="absolute -top-8 -right-8 w-18 md:w-22 drop-shadow-md z-30 pointer-events-none" 
              animate={{ y: [0, -8, 0], rotate: [-4, 6, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Polaroid 2 */}
          <motion.div style={{ y: y3 }} className="z-10">
            <Polaroid 
              text={DATA.moments[1].text} 
              rotation={-4} 
              delay={0.5} 
            />
          </motion.div>

        </div>
      </div>
      
      {/* Background ambient stickers (parallaxed) */}
      <motion.img 
        src="/stickers/stamp.webp" 
        alt="Vintage Stamp"
        className="absolute top-36 right-8 md:right-16 w-32 md:w-40 drop-shadow-lg z-0 pointer-events-none"
        style={{ y: y3, rotate: 12 }}
      />
      <motion.img 
        src="/stickers/frame.webp" 
        alt="Vintage Frame"
        className="absolute top-20 left-4 md:left-16 w-32 md:w-44 drop-shadow-xl z-0 pointer-events-none opacity-85"
        style={{ y: y1, rotate: -10 }}
      />
      <motion.img 
        src="/stickers/boquet1.webp" 
        alt="Flower Bouquet"
        className="absolute bottom-28 right-4 md:right-32 w-32 md:w-44 drop-shadow-xl z-10 pointer-events-none"
        style={{ y: y2, rotate: 14 }}
      />
      <motion.img 
        src="/stickers/camera_leica.webp" 
        alt="Leica Camera"
        className="absolute bottom-8 left-6 md:left-14 w-44 md:w-56 drop-shadow-xl z-20 pointer-events-none"
        style={{ y: y4, rotate: -8 }}
      />
      <motion.img 
        src="/stickers/gitar.webp" 
        alt="Red Guitar"
        className="absolute -bottom-10 right-10 md:right-24 w-36 md:w-48 drop-shadow-2xl z-20 pointer-events-none"
        style={{ y: y1, rotate: 18 }}
      />

    </section>
  );
}
