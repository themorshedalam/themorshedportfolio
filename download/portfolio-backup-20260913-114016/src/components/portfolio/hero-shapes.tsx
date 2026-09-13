"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Floating geometric shapes inspired by the GSAP "Animate Anything" hero.
 * Clean black-on-white editorial shapes (mix of solid, outline, and
 * reduced-opacity) that drift and rotate continuously for ambient motion,
 * with subtle mouse parallax (each shape moves a different amount based
 * on its `depth` value).
 *
 * Structure: outer (position + entrance + rotation) → middle (mouse
 * parallax) → inner (continuous drift). Three nested layers so the
 * transforms compose cleanly.
 */

/* ---------- Individual shape SVGs ---------- */

function FilledCircle({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="10" fill="currentColor" />
    </svg>
  );
}

function RingCircle({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function FourStar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 2 L19 13 L30 16 L19 19 L16 30 L13 19 L2 16 L13 13 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Plus({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <path d="M12 2 H16 V12 H26 V16 H16 V26 H12 V16 H2 V12 H12 Z" fill="currentColor" />
    </svg>
  );
}

function Windmill({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 22 C 22 12, 30 8, 34 12 C 38 16, 32 22, 22 22" />
        <path d="M22 22 C 32 22, 36 30, 32 34 C 28 38, 22 32, 22 22" />
        <path d="M22 22 C 22 32, 14 36, 10 32 C 6 28, 12 22, 22 22" />
        <path d="M22 22 C 12 22, 8 14, 12 10 C 16 6, 22 12, 22 22" />
        <circle cx="22" cy="22" r="2.5" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

function Squiggle({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.4} viewBox="0 0 48 20" fill="none">
      <path
        d="M2 10 Q 8 2, 14 10 T 26 10 T 38 10 T 46 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function SemiCircle({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 36 22" fill="none">
      <path d="M2 22 A 16 16 0 0 1 34 22 Z" fill="currentColor" />
    </svg>
  );
}

function Triangle({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.87} viewBox="0 0 30 26" fill="none">
      <path d="M15 2 L28 24 L2 24 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Asterisk({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="13" y1="2" x2="13" y2="24" />
        <line x1="2" y1="13" x2="24" y2="13" />
        <line x1="5" y1="5" x2="21" y2="21" />
        <line x1="21" y1="5" x2="5" y2="21" />
      </g>
    </svg>
  );
}

/* ---------- A single floating shape (3-layer transform) ---------- */

type FloatShapeProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
  delay?: number;
  driftX?: number;
  driftY?: number;
  rotateFrom?: number;
  rotateTo?: number;
  depth?: number; // 0..1 parallax strength
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
};

function FloatShape({
  children,
  className = "",
  style,
  duration = 8,
  delay = 0,
  driftX = 14,
  driftY = 14,
  rotateFrom = -12,
  rotateTo = 12,
  depth = 0.3,
  mouseX,
  mouseY,
}: FloatShapeProps) {
  // Scale the normalized mouse value (-1..1) to pixels by depth.
  // useTransform is a hook — called unconditionally with a fallback.
  const px = useTransform(mouseX ?? 0, (v) => v * depth * 24);
  const py = useTransform(mouseY ?? 0, (v) => v * depth * 24);

  return (
    <motion.div
      className={`absolute ${className}`}
      style={style}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1],
        scale: [0.5, 1],
        rotate: [rotateFrom, rotateTo, rotateFrom],
      }}
      transition={{
        opacity: { delay: delay + 0.2, duration: 0.8 },
        scale: { delay: delay + 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
        rotate: {
          delay,
          duration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      }}
    >
      {/* Mouse parallax layer */}
      <motion.div style={{ x: px, y: py }}>
        {/* Continuous drift layer */}
        <motion.div
          animate={{
            y: [0, -driftY, 0],
            x: [0, driftX, 0],
          }}
          transition={{
            delay,
            duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- The full shape field ---------- */

export function HeroShapes({
  mouseX,
  mouseY,
}: {
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden text-foreground">
      {/* Top-left — windmill */}
      <FloatShape
        className="text-foreground/70"
        style={{ top: "16%", left: "12%" }}
        duration={11}
        delay={0.1}
        driftX={10}
        driftY={16}
        rotateFrom={-20}
        rotateTo={40}
        depth={0.7}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <Windmill size={48} />
      </FloatShape>

      {/* Top-right — 4-point star */}
      <FloatShape
        className="text-foreground"
        style={{ top: "14%", right: "14%" }}
        duration={9}
        delay={0.25}
        driftX={12}
        driftY={10}
        rotateFrom={0}
        rotateTo={90}
        depth={0.5}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <FourStar size={30} />
      </FloatShape>

      {/* Mid-left — ring circle */}
      <FloatShape
        className="text-foreground/30"
        style={{ top: "40%", left: "8%" }}
        duration={13}
        delay={0.15}
        driftX={8}
        driftY={18}
        rotateFrom={0}
        rotateTo={0}
        depth={0.9}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <RingCircle size={44} />
      </FloatShape>

      {/* Mid-right — filled circle */}
      <FloatShape
        className="text-foreground/80"
        style={{ top: "38%", right: "10%" }}
        duration={10}
        delay={0.3}
        driftX={14}
        driftY={12}
        depth={0.6}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <FilledCircle size={22} />
      </FloatShape>

      {/* Bottom-left — plus sign */}
      <FloatShape
        className="text-foreground/60"
        style={{ bottom: "18%", left: "16%" }}
        duration={8}
        delay={0.4}
        driftX={10}
        driftY={14}
        rotateFrom={0}
        rotateTo={45}
        depth={0.4}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <Plus size={26} />
      </FloatShape>

      {/* Bottom-right — squiggle */}
      <FloatShape
        className="text-foreground/50"
        style={{ bottom: "16%", right: "16%" }}
        duration={12}
        delay={0.2}
        driftX={16}
        driftY={10}
        rotateFrom={-8}
        rotateTo={8}
        depth={0.5}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <Squiggle size={52} />
      </FloatShape>

      {/* Far left mid — semi circle */}
      <FloatShape
        className="text-foreground/40"
        style={{ top: "60%", left: "6%" }}
        duration={14}
        delay={0.35}
        driftX={8}
        driftY={14}
        rotateFrom={-15}
        rotateTo={15}
        depth={0.8}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <SemiCircle size={34} />
      </FloatShape>

      {/* Far right mid — triangle */}
      <FloatShape
        className="text-foreground/35"
        style={{ top: "62%", right: "7%" }}
        duration={10}
        delay={0.5}
        driftX={12}
        driftY={10}
        rotateFrom={-10}
        rotateTo={20}
        depth={0.7}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <Triangle size={28} />
      </FloatShape>

      {/* Top-center — small asterisk */}
      <FloatShape
        className="text-foreground/45"
        style={{ top: "22%", left: "50%" }}
        duration={7}
        delay={0.6}
        driftX={6}
        driftY={12}
        rotateFrom={0}
        rotateTo={90}
        depth={0.3}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <Asterisk size={20} />
      </FloatShape>

      {/* Bottom-center — small filled dot */}
      <FloatShape
        className="text-foreground/50"
        style={{ bottom: "24%", left: "48%" }}
        duration={9}
        delay={0.45}
        driftX={10}
        driftY={8}
        depth={0.4}
        mouseX={mouseX}
        mouseY={mouseY}
      >
        <FilledCircle size={14} />
      </FloatShape>
    </div>
  );
}
