"use client";

import { motion } from "framer-motion";
import { ActivityGallery } from "@/site/ActivityGallery";
import { MemberCarousel } from "@/site/MemberCarousel";
import { TapCue } from "@/site/TapCue";
import { VINYL_ASSETS } from "@/site/VinylStage";
import type { ViewportMode } from "./model";

type Props = {
  name: string;
  viewport: ViewportMode;
  settings?: Record<string, string | number | boolean>;
};

export function SpecialElement({
  name,
  viewport,
  settings,
}: Props) {
  if (name === "vinyl" || name === "vinyl-compact") {
    return <EditorVinyl />;
  }
  if (name === "tap-cue") {
    return <TapCue embedded />;
  }
  if (name === "members") {
    const fallback = viewport === "mobile" ? 90 : 38;
    return (
      <MemberCarousel
        embedded
        speedSeconds={Number(settings?.speed ?? fallback)}
      />
    );
  }
  if (name === "activities") {
    return <ActivityGallery embedded />;
  }
  return <div>{name}</div>;
}

function EditorVinyl() {
  return (
    <div className="editor-vinyl">
      <motion.div
        className="editor-vinyl-spin"
        animate={{ rotate: 360 }}
        transition={{
          duration: 24,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <img src={VINYL_ASSETS.vinyl} alt="" />
        <img src={VINYL_ASSETS.label} alt="" />
        <img src={VINYL_ASSETS.sax} alt="" />
      </motion.div>
    </div>
  );
}
