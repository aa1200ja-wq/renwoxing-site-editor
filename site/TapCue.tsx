"use client";

import "./tap-cue.css";

const handUrl = "https://at.adobe.com/5PsW5E8IbnwQQyie";

export function TapCue({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={embedded ? "tap-cue embedded" : "tap-cue"} aria-hidden="true">
      <img className="tap-hand-cycle" src={handUrl} alt="" />
      <strong>點一下</strong>
      <span>進入專輯</span>
      <small className="tap-text-blink">TAP TO PLAY</small>
    </div>
  );
}
