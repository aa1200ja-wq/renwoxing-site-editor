"use client";

import { motion } from "framer-motion";
import { members } from "@/site/member-data";
import type { ViewportMode } from "./model";
import "./special-elements.css";

const vinylAssets = {
  vinyl: "/assets/renwoxing/vinyl-disc.webp",
  label: "/assets/renwoxing/label-gold.webp",
  sax: "/assets/renwoxing/saxophone.webp",
};

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

  if (name === "members") {
    const fallback = viewport === "mobile" ? 120 : 42;
    return (
      <EditorMemberCarousel
        speedSeconds={Number(settings?.speed ?? fallback)}
      />
    );
  }

  if (name === "activities") {
    return <div className="editor-special-placeholder">活動照片</div>;
  }

  if (name === "tap-cue") {
    return <div className="editor-special-placeholder">點擊提示</div>;
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
        <img src={vinylAssets.vinyl} alt="" />
        <img src={vinylAssets.label} alt="" />
        <img src={vinylAssets.sax} alt="" />
      </motion.div>
    </div>
  );
}

function EditorMemberCarousel({
  speedSeconds,
}: {
  speedSeconds: number;
}) {
  const loopMembers = [...members, ...members];

  return (
    <div className="editor-member-carousel">
      <div
        className="editor-member-track"
        style={{ animationDuration: speedSeconds + "s" }}
      >
        {loopMembers.map((member, index) => (
          <div
            className="editor-member-card"
            key={member.id + "-" + index}
          >
            <img src={member.cover} alt={member.name} />
            <strong>{member.name}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
