"use client";

import { motion } from "framer-motion";

export const VINYL_ASSETS = {
  vinyl: "https://at.adobe.com/3NErmny4FBbRuQVs",
  label: "https://at.adobe.com/AOMAGP6BeJpm2mWt",
  sax: "https://at.adobe.com/5A0ozpiYI4J3NTFA",
};

type Props = {
  compact: boolean;
  onActivate?: () => void;
};

export function VinylStage({ compact, onActivate }: Props) {
  return (
    <motion.button
      type="button"
      className={compact ? "vinyl-stage compact" : "vinyl-stage"}
      onClick={onActivate}
      layout
      aria-label="開啟任我行內容"
      transition={{ type: "spring", stiffness: 85, damping: 20 }}
    >
      <motion.div
        className="vinyl-spin"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
      >
        <img className="vinyl-disc" src={VINYL_ASSETS.vinyl} alt="" />
        <img className="vinyl-label" src={VINYL_ASSETS.label} alt="" />
        <img className="vinyl-sax" src={VINYL_ASSETS.sax} alt="" />
      </motion.div>
    </motion.button>
  );
}
