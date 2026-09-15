"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * GSAP-inspired animated hero section.
 * Dark text on white background, JetBrains Mono font.
 * Floating geometric shapes with gradients drift + rotate around
 * an "Animate anything" style headline with per-character reveal.
 * Shapes react to mouse movement with parallax.
 */

type ShapeType = "blob" | "star" | "circle" | "ring" | "squiggle" | "plus";

type ShapeConfig = {
  type: ShapeType;
  gradient: [string, string];
  style: React.CSSProperties;
  size: number;
  duration: number;
  delay: number;
  depth: number;
  rotateRange: [number, number];
};

const shapes: ShapeConfig[] = [
  { type: "blob", gradient: ["#FF6B35", "#F7931E"], style: { top: "15%", left: "8%" }, size: 80, duration: 8, delay: 0.2, depth: 0.8, rotateRange: [-30, 30] },
  { type: "star", gradient: ["#9B5DE5", "#F15BB5"], style: { top: "10%", right: "12%" }, size: 50, duration: 6, delay: 0.4, depth: 0.5, rotateRange: [0, 180] },
  { type: "circle", gradient: ["#00BBF9", "#00F5D4"], style: { top: "40%", left: "5%" }, size: 60, duration: 10, delay: 0.1, depth: 0.9, rotateRange: [0, 0] },
  { type: "ring", gradient: ["#FEE440", "#F15BB5"], style: { top: "35%", right: "8%" }, size: 70, duration: 7, delay: 0.3, depth: 0.6, rotateRange: [0, 360] },
  { type: "squiggle", gradient: ["#9B5DE5", "#00BBF9"], style: { bottom: "18%", left: "12%" }, size: 90, duration: 9, delay: 0.5, depth: 0.4, rotateRange: [-15, 15] },
  { type: "plus", gradient: ["#FF6B35", "#FEE440"], style: { bottom: "15%", right: "15%" }, size: 45, duration: 5, delay: 0.15, depth: 0.7, rotateRange: [0, 90] },
  { type: "circle", gradient: ["#F15BB5", "#FF6B35"], style: { top: "60%", right: "20%" }, size: 30, duration: 6, delay: 0.6, depth: 0.3, rotateRange: [0, 0] },
  { type: "blob", gradient: ["#00F5D4", "#00BBF9"], style: { bottom: "30%", left: "25%" }, size: 40, duration: 11, delay: 0.25, depth: 0.5, rotateRange: [-20, 20] },
];

export function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 50, damping: 20, mass: 0.5 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };

  const headline1 = "Animate".split("");
  const headline2 = "anything".split("");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouse}
      className="relative flex min-h-[340px] items-center justify-center overflow-hidden bg-[var(--cream)] px-6 py-16"
    >
      {/* Floating shapes */}
      {shapes.map((shape, i) => (
        <FloatingShape key={i} shape={shape} index={i} mouseX={sx} mouseY={sy} />
      ))}

      {/* Headline text — GSAP-style staggered drop-in with bounce */}
      <div className="relative z-10 text-center">
        <div className="flex justify-center overflow-hidden">
          {headline1.map((char, i) => (
            <motion.span
              key={`l1-${i}`}
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                delay: 0.3 + i * 0.06,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-mono-display inline-block text-[clamp(1.5rem,4vw,2.5rem)] text-foreground"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
        <div className="flex justify-center overflow-hidden">
          {headline2.map((char, i) => (
            <motion.span
              key={`l2-${i}`}
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{
                delay: 0.3 + (headline1.length + i) * 0.06,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-mono-display inline-block text-[clamp(1.5rem,4vw,2.5rem)] text-foreground"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FloatingShape({
  shape,
  index,
  mouseX,
  mouseY,
}: {
  shape: ShapeConfig;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const px = useTransform(mouseX, (v) => v * shape.depth * 20);
  const py = useTransform(mouseY, (v) => v * shape.depth * 20);
  const gradId = `grad-${index}`;
  const gradUrl = `url(#${gradId})`;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ ...shape.style, x: px, y: py }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: shape.rotateRange,
      }}
      transition={{
        opacity: { delay: shape.delay + 0.3, duration: 0.6 },
        scale: { delay: shape.delay + 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
        rotate: {
          delay: shape.delay,
          duration: shape.duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      }}
    >
      <motion.div
        animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
        transition={{
          delay: shape.delay,
          duration: shape.duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <svg width={shape.size} height={shape.size} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={shape.gradient[0]} />
              <stop offset="100%" stopColor={shape.gradient[1]} />
            </linearGradient>
          </defs>
          {renderShape(shape.type, gradUrl)}
        </svg>
      </motion.div>
    </motion.div>
  );
}

function renderShape(type: ShapeType, fill: string) {
  switch (type) {
    case "circle":
      return <circle cx="50" cy="50" r="35" fill={fill} />;
    case "ring":
      return <circle cx="50" cy="50" r="35" fill="none" stroke={fill} strokeWidth="8" />;
    case "star":
      return <path d="M50 5 L60 35 L95 50 L60 65 L50 95 L40 65 L5 50 L40 35 Z" fill={fill} transform="scale(0.8) translate(12.5, 12.5)" />;
    case "plus":
      return <path d="M40 15 H60 V40 H85 V60 H60 V85 H40 V60 H15 V40 H40 Z" fill={fill} transform="scale(0.7) translate(21, 21)" />;
    case "squiggle":
      return <path d="M10 50 Q 25 20, 40 50 T 70 50 T 90 50" fill="none" stroke={fill} strokeWidth="10" strokeLinecap="round" />;
    case "blob":
      return <path d="M50 15 C 70 15, 85 30, 85 50 C 85 70, 70 85, 50 85 C 30 85, 15 70, 15 50 C 15 30, 30 15, 50 15 Z" fill={fill} transform="scale(0.85) translate(8.8, 8.8)" />;
    default:
      return <circle cx="50" cy="50" r="35" fill={fill} />;
  }
}
