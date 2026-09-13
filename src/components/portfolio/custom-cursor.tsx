"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Premium two-element cursor: a small dot that tracks instantly,
 * and a larger ring that trails with spring physics. Grows when
 * hovering interactive elements (links, buttons, project items).
 *
 * The DOM is always rendered; CSS hides it on coarse pointers and
 * small screens. Listeners only attach on fine-pointer desktops,
 * so no setState-in-effect is needed.
 */
export function CustomCursor() {
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.innerWidth < 1024) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        'a, button, [role="button"], [data-cursor="view"], input, textarea, [data-cursor="link"]'
      );
      setActive(interactive);
    };
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [x, y]);

  return (
    <div
      aria-hidden
      className="custom-cursor pointer-events-none fixed inset-0 z-[100] mix-blend-difference"
      style={{ opacity: hidden ? 0 : 1, transition: "opacity 0.3s" }}
    >
      {/* Outer ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute">
        <motion.div
          animate={{
            width: active ? 56 : 32,
            height: active ? 56 : 32,
            opacity: active ? 0.9 : 0.45,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="rounded-full border border-white"
          style={{ translateX: "-50%", translateY: "-50%" }}
        />
      </motion.div>
      {/* Inner dot */}
      <motion.div style={{ x, y }} className="absolute -ml-[3px] -mt-[3px]">
        <motion.div
          animate={{ scale: active ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="h-1.5 w-1.5 rounded-full bg-white"
        />
      </motion.div>
    </div>
  );
}
