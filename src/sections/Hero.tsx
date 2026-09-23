import { motion, useScroll, useTransform } from 'framer-motion';
import { DATA } from '../utils/constants';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { sfx } from '../utils/sfx';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const balloonsLeftRef = useRef<HTMLImageElement>(null);
  const balloonsRightRef = useRef<HTMLImageElement>(null);
  const hatRef = useRef<HTMLImageElement>(null);
  const balonRef = useRef<HTMLImageElement>(null);
  const emblemRef = useRef<HTMLImageElement>(null);
  const flowerBranchRef = useRef<HTMLImageElement>(null);
  const driedFlowerRef = useRef<HTMLImageElement>(null);
  const dateRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLParagraphElement>(null);
  const promptRef = useRef<HTMLParagraphElement>(null);

  const hasPlayedRef = useRef(false);

  // Scroll parallax transforms
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const yBalloonsLeft = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const yBalloonsRight = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const yPartyHat = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yCurve = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yFloral = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scaleCard = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacityCard = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.85, 0]);

  // GSAP Intro Drop-Down Spring Landing Timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.6,
        onStart: () => {
          if (!hasPlayedRef.current) {
            sfx.play('whoosh');
            hasPlayedRef.current = true;
          }
        },
      });

      // 1. Main Birthday Parchment Card: Drops from top with heavy elastic spring landing bounce
      if (cardRef.current) {
        tl.fromTo(
          cardRef.current,
          {
            y: -750,
            opacity: 0,
            scale: 1.15,
            rotateX: 18,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 2.4,
            ease: 'elastic.out(1, 0.45)',
          }
        );
      }

      // 2. Balloons, Badges & Party Hat: Staggered drop-down spring landings
      const dropElements = [
        balloonsLeftRef.current,
        balloonsRightRef.current,
        hatRef.current,
        balonRef.current,
        emblemRef.current,
      ].filter(Boolean);

      if (dropElements.length > 0) {
        tl.fromTo(
          dropElements,
          {
            y: -550,
            opacity: 0,
            scale: 0.4,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.8,
            stagger: 0.12,
            ease: 'elastic.out(1, 0.5)',
          },
          '-=1.6'
        );
      }

      // 3. Flower branches & Dried Flower accents: Rotate & spring into position
      const floralElements = [flowerBranchRef.current, driedFlowerRef.current].filter(Boolean);
      if (floralElements.length > 0) {
        tl.fromTo(
          floralElements,
          {
            scale: 0,
            opacity: 0,
            rotate: -45,
          },
          {
            scale: 1,
            opacity: 1,
            rotate: 15,
            duration: 1.6,
            stagger: 0.15,
            ease: 'back.out(1.7)',
          },
          '-=1.2'
        );
      }

      // 4. Typography & Heartfelt Text: Smooth sequential transition (3-second calm transition)
      const textElements = [
        dateRef.current,
        headingRef.current,
        lineRef.current,
        scriptRef.current,
        promptRef.current,
      ].filter(Boolean);

      if (textElements.length > 0) {
        tl.fromTo(
          textElements,
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            stagger: 0.25,
            ease: 'power2.out',
          },
          '-=0.6'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center py-20 overflow-hidden"
    >
      {/* FULL-BLEED PARALLAX BACKGROUND LAYERS */}
      {/* 1. Burgundy Curve Overlay */}
      <motion.img
        src="/parallax/burgundy_curve.webp"
        alt="Burgundy Curve Parallax"
        style={{ y: yCurve }}
        className="absolute -bottom-24 -left-12 md:-left-24 w-[130%] md:w-[110%] max-w-none opacity-20 mix-blend-multiply pointer-events-none select-none z-0"
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 3, delay: 0.5, ease: 'easeOut' }}
      />

      {/* 2. Vintage Floral Botanical Parallax (Top Right) */}
      <motion.img
        src="/parallax/floral_01.webp"
        alt="Floral Botanical Parallax"
        style={{ y: yFloral }}
        className="absolute -top-24 -right-16 md:-right-24 w-[85%] md:w-[55%] max-w-3xl opacity-25 mix-blend-multiply pointer-events-none select-none z-0"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 0.25, y: 0 }}
        transition={{ duration: 3, delay: 1, ease: 'easeOut' }}
      />

      {/* Skydive Atmosphere Streaks */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 3.5, ease: 'easeOut', delay: 0.5 }}
      >
        <motion.div
          className="w-full h-[250%] flex justify-around opacity-25"
          initial={{ y: '-60%' }}
          animate={{ y: '100%' }}
          transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-[1.5px] h-96 bg-gradient-to-b from-transparent via-burgundy to-transparent" />
          <div className="w-[2px] h-[32rem] bg-gradient-to-b from-transparent via-accent to-transparent" />
          <div className="w-[1.5px] h-80 bg-gradient-to-b from-transparent via-burgundy to-transparent" />
          <div className="w-[2px] h-[28rem] bg-gradient-to-b from-transparent via-accent to-transparent" />
        </motion.div>
      </motion.div>

      {/* GSAP Drop-Down Spring Element 1: Left 18 Balloons */}
      <motion.img
        ref={balloonsLeftRef}
        src="/stickers/balloons_18.webp"
        alt="18 Balloons"
        style={{ y: yBalloonsLeft }}
        className="absolute top-10 left-4 md:left-20 w-32 md:w-48 z-20 drop-shadow-2xl pointer-events-none select-none"
      />

      {/* GSAP Drop-Down Spring Element 2: Right Heart Balloons */}
      <motion.img
        ref={balloonsRightRef}
        src="/stickers/heart_balloons.webp"
        alt="Heart Balloons"
        style={{ y: yBalloonsRight }}
        className="absolute top-20 right-4 md:right-20 w-32 md:w-48 z-0 drop-shadow-xl pointer-events-none select-none"
      />

      {/* GSAP Drop-Down Spring Element 3: Party Hat */}
      <motion.img
        ref={hatRef}
        src="/stickers/party_hat.webp"
        alt="Party Hat"
        style={{ y: yPartyHat }}
        className="absolute bottom-20 left-10 w-24 md:w-32 z-20 drop-shadow-lg pointer-events-none select-none"
      />

      {/* GSAP Drop-Down Spring Element 4: Celebration Balloons */}
      <motion.img
        ref={balonRef}
        src="/stickers/balon.webp"
        alt="Balloons"
        style={{ y: yBalloonsLeft }}
        className="absolute bottom-16 right-8 md:right-28 w-28 md:w-40 z-20 drop-shadow-2xl pointer-events-none select-none"
      />

      {/* GSAP Drop-Down Spring Element 5: Golden '18' Emblem */}
      <motion.img
        ref={emblemRef}
        src="/stickers/18.webp"
        alt="18 Badge"
        className="absolute top-6 left-1/2 -translate-x-1/2 w-16 md:w-20 z-20 drop-shadow-xl pointer-events-none select-none"
      />

      {/* GSAP Main Drop-Down Spring Landing: Parchment Birthday Card */}
      <motion.div
        ref={cardRef}
        style={{
          y: yCard,
          scale: scaleCard,
          opacity: opacityCard,
          borderRadius: '3px 4px 3px 5px',
          border: '1px solid rgba(59, 10, 18, 0.12)',
        }}
        className="w-[90%] max-w-2xl bg-card p-10 md:p-16 relative shadow-2xl z-10"
      >
        <div className="absolute inset-0 border-2 border-dashed border-burgundy/20 m-3 pointer-events-none" />

        <div className="relative z-10 text-center">
          <p
            ref={dateRef}
            className="font-mono text-accent text-sm md:text-base mb-6 tracking-widest uppercase"
          >
            {DATA.date}
          </p>

          <h1
            ref={headingRef}
            className="font-serif text-4xl md:text-6xl text-burgundy font-medium leading-tight mb-6 relative"
          >
            Happy {DATA.age}th Birthday, <br />
            <span className="italic">{DATA.receiver}</span>
          </h1>

          <div ref={lineRef} className="w-16 h-[1px] bg-accent/50 mx-auto mb-6" />

          <p ref={scriptRef} className="font-script text-2xl md:text-3xl text-burgundy/80">
            {DATA.heroText}
          </p>

          <motion.p
            ref={promptRef}
            animate={{
              opacity: [0.45, 0.95, 0.45],
              y: [0, 5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.4,
              ease: 'easeInOut',
            }}
            className="font-mono text-xs text-burgundy/60 mt-12 tracking-wider"
          >
            ↓ Scroll down to read ↓
          </motion.p>
        </div>

        {/* Flower Branch Framing */}
        <motion.img
          ref={flowerBranchRef}
          src="/stickers/flower_branch_1.webp"
          alt="Flower Branch"
          className="absolute -top-12 -right-16 md:-top-16 md:-right-24 w-48 md:w-64 z-30 drop-shadow-lg pointer-events-none select-none"
        />

        {/* Vintage Dried Flower Accent */}
        <motion.img
          ref={driedFlowerRef}
          src="/stickers/flower-1.webp"
          alt="Dried Flower"
          className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-12 w-28 md:w-36 z-30 drop-shadow-md pointer-events-none select-none"
        />
      </motion.div>
    </section>
  );
}
