"use client";

import { ActivityGallery } from "@/site/ActivityGallery";
import { MemberCarousel } from "@/site/MemberCarousel";
import { TapCue } from "@/site/TapCue";
import { VinylStage } from "@/site/VinylStage";

export function SpecialElement({ name }: { name: string }) {
  if (name === "vinyl") {
    return <VinylStage compact={false} />;
  }
  if (name === "vinyl-compact") {
    return <VinylStage compact />;
  }
  if (name === "tap-cue") {
    return <TapCue embedded />;
  }
  if (name === "members") {
    return <MemberCarousel embedded />;
  }
  if (name === "activities") {
    return <ActivityGallery embedded />;
  }
  return <div>{name}</div>;
}
