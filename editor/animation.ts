import type { MotionProps } from "framer-motion";
import type { AnimationSpec } from "./model";

export function motionProps(animation?: AnimationSpec): MotionProps {
  if (!animation || animation.preset === "none") return {};
  const transition: MotionProps["transition"] = {
    duration: animation.duration,
    delay: animation.delay,
    ease: normalizeEase(animation.easing),
    repeat: animation.trigger === "loop" ? Infinity : 0,
  };
  if (animation.trigger === "hover") {
    return { whileHover: presetTarget(animation.preset), transition };
  }
  return {
    initial: presetInitial(animation.preset),
    animate: presetTarget(animation.preset),
    transition,
  };
}

function normalizeEase(value: string) {
  if (value === "linear") return "linear" as const;
  if (value === "easeIn") return "easeIn" as const;
  if (value === "easeInOut") return "easeInOut" as const;
  return "easeOut" as const;
}

function presetTarget(preset: AnimationSpec["preset"]) {
  switch (preset) {
    case "fade":
    case "fade-up":
    case "slide-left":
    case "slide-right":
      return { opacity: 1, x: 0, y: 0 };
    case "scale": return { opacity: 1, scale: 1 };
    case "spin": return { rotate: 360 };
    default: return {};
  }
}

function presetInitial(preset: AnimationSpec["preset"]) {
  switch (preset) {
    case "fade": return { opacity: 0 };
    case "fade-up": return { opacity: 0, y: 24 };
    case "slide-left": return { opacity: 0, x: 40 };
    case "slide-right": return { opacity: 0, x: -40 };
    case "scale": return { opacity: 0, scale: 0.92 };
    case "spin": return { rotate: 0 };
    default: return {};
  }
}
