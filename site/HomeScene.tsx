"use client";

import { motion } from "framer-motion";
import { VinylStage } from "./VinylStage";

const handUrl = "https://at.adobe.com/5PsW5E8IbnwQQyie";

export function HomeScene({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.section
      className="hero-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="hero-kicker">SAXOPHONE ENSEMBLE</p>

      <motion.h1
        className="vertical-title"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span>任</span>
        <span>我</span>
        <span>行</span>
      </motion.h1>

      <div className="hero-vinyl-wrap">
        <VinylStage compact={false} onActivate={onEnter} />
      </div>

      <div className="hero-copy">
        <button type="button" onClick={onEnter} className="hero-link">
          ▶ 活動影片欣賞
        </button>
        <p>旋律，仍在前行。</p>
        <span className="gold-rule" />
        <small>PEOPLE<br />MUSIC<br />FURTHER</small>
      </div>

      <div className="tap-cue" aria-hidden="true">
        <motion.img
          src={handUrl}
          alt=""
          animate={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <strong>點一下</strong>
        <span>進入專輯</span>
        <small>TAP TO PLAY</small>
      </div>

      <div className="hero-tagline">
        <span>／</span>
        <div>
          <strong>把每一段旋律</strong>
          <p>刻進值得被記住的時光。</p>
        </div>
      </div>
    </motion.section>
  );
}
