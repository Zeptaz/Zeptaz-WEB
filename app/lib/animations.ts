import { Variants } from 'framer-motion';

// ─── Spring Config (Fuel-inspired: stiffness 300, damping 60) ───────
export const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 60,
  mass: 1,
};

// ─── Dramatic Spring Up (Hero-style, y:120→0) ──────────────────────
export const dramaticSpringUp: Variants = {
  hidden: { opacity: 0.001, y: 120 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...springTransition, delay }
  })
};

// ─── Spring Fade Up ─────────────────────────────────────────────────
export const springFadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...springTransition, delay }
  })
};

// ─── Scale In Zoom (Fuel-style, scale 1.2→1) ───────────────────────
export const scaleInZoom: Variants = {
  hidden: { opacity: 0.001, scale: 1.2 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: [0.44, 0, 0.56, 1] }
  }
};

// ─── Spring Stagger Container ───────────────────────────────────────
export const springStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

// ─── Spring Stagger Item ────────────────────────────────────────────
export const springStaggerItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  }
};

// ─── Spring Slide Left ──────────────────────────────────────────────
export const springSlideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  }
};

// ─── Spring Slide Right ─────────────────────────────────────────────
export const springSlideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springTransition
  }
};

// ─── Shared Fade In Up ──────────────────────────────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// ─── Staggered Container ────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// ─── Staggered Item ─────────────────────────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// ─── Scale In ───────────────────────────────────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

// ─── Slide In From Left ─────────────────────────────────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// ─── Slide In From Right ────────────────────────────────────────────
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

// ─── Hover Card Lift ────────────────────────────────────────────────
export const hoverLift = {
  rest: { y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  hover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } }
};

// ─── Button Hover ───────────────────────────────────────────────────
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 }
};

// ═══════════════════════════════════════════════════════════════════
// ─── Nivora Animation System ────────────────────────────────────────
// Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94) — smooth ease-out
// Duration: 0.6s standard, 0.8s hero, 0.25s hover
// Stagger: 0.08s between children
// ═══════════════════════════════════════════════════════════════════

export const nivoraEase = [0.25, 0.46, 0.45, 0.94] as const;

// Standard entrance — opacity 0→1, y 30→0
export const nivoraFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }
  })
};

// Stagger container — 0.08s between children
export const nivoraStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

// Stagger item — used inside nivoraStagger
export const nivoraStaggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// 3D tilt hover — use as whileHover prop directly
// Parent needs style={{ perspective: '800px' }}
export const nivoraTiltHover = {
  rotateX: 5,
  rotateY: -5,
  scale: 1.01,
  transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
};

// Hero headline entrance — scale + fade
export const nivoraHeroScale: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

// Slide in from left — 0.6s Nivora ease
export const nivoraSlideLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }
  })
};

// Slide in from right — 0.6s Nivora ease
export const nivoraSlideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }
  })
};

// ─── Mirror Pulse — seamless pingpong opacity, no end-of-cycle jump ──
export const mirrorPulse = {
  animate: { opacity: [0.4, 1] },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'mirror' as const,
    ease: 'easeInOut',
  },
};

// ─── Directional Exit — custom prop drives exit direction ────────────
export const directionalExit: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: (dir: 'up' | 'down' = 'down') => ({
    opacity: 0,
    y: dir === 'down' ? 40 : -40,
    scale: 0.95,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  }),
};

// ─── Center Stagger — 0.07s stagger for nav/step lists ──────────────
// Note: true "from:center" requires imperative animate(); this declarative
// version provides consistent stagger timing for use in Variants.
export const centerStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};
