import { motion } from 'framer-motion';
import { sfx } from '../utils/sfx';

interface PolaroidProps {
  text: string;
  rotation: number;
  delay: number;
  img?: string;
}

export default function Polaroid({ text, rotation, delay, img }: PolaroidProps) {
  return (
    <motion.div
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
        {img ? (
          <img src={img} alt={text} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-burgundy/40 mix-blend-multiply" />
        )}
      </div>
      <p className="font-script text-xl md:text-2xl text-center text-burgundy">
        {text}
      </p>
      
      {/* Tape decoration */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-sm shadow-sm"
        style={{ transform: `translateX(-50%) rotate(${rotation > 0 ? -3 : 3}deg)` }}
      />
    </motion.div>
  );
}
