import type { SiteElement } from "./model";
import { sections } from "@/site/scene-data";

type LayoutFactory = (
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex?: number,
) => {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  visible: boolean;
};

export function makeNavElements(layout: LayoutFactory): SiteElement[] {
  return sections.map((section, index) => ({
    id: `nav-${section.id}`,
    type: "text",
    name: `導覽-${section.label}`,
    content: section.label,
    desktop: layout(570 + index * 112, 62, 102, 34, 6),
    mobile: layout(
      18 + (index % 3) * 118,
      338 + Math.floor(index / 3) * 30,
      108,
      24,
      6,
    ),
    style: {
      color: "#3d3022",
      fontSize: 15,
      fontWeight: 700,
      whiteSpace: "nowrap",
    },
  }));
}

export function makeEventElements(layout: LayoutFactory): SiteElement[] {
  return [1, 2, 3].map((number, index) => ({
    id: `activity-photo-${number}`,
    type: "image",
    name: `活動照片 ${number}`,
    content: `/assets/renwoxing/activity-0${number}.webp`,
    desktop: layout(790 + index * 195, 600, 180, 230, 5),
    mobile: layout(24 + index * 112, 655, 104, 140, 5),
    style: { objectFit: "cover" },
  }));
}

export function makeHomeExtraElements(layout: LayoutFactory): SiteElement[] {
  return [
    {
      id: "hero-kicker",
      type: "text",
      name: "首頁英文小標",
      content: "SAXOPHONE ENSEMBLE",
      desktop: layout(245, 78, 230, 26, 6),
      mobile: layout(24, 42, 210, 24, 6),
      style: {
        color: "#c68b2d",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.2,
      },
    },
    {
      id: "hero-video-link",
      type: "text",
      name: "活動影片欣賞",
      content: "▶ 活動影片欣賞",
      desktop: layout(1080, 350, 190, 40, 7),
      mobile: layout(230, 70, 140, 32, 7),
      style: {
        color: "#d29a3d",
        fontSize: 16,
        fontWeight: 600,
      },
    },
    {
      id: "hero-status",
      type: "text",
      name: "旋律仍在前行",
      content: "旋律，仍在前行。",
      desktop: layout(1080, 465, 210, 32, 7),
      mobile: layout(220, 585, 150, 28, 7),
      style: {
        color: "#e8ddc6",
        fontSize: 16,
        fontWeight: 500,
      },
    },
    {
      id: "hero-status-line",
      type: "line",
      name: "狀態金線",
      content: "",
      desktop: layout(1080, 505, 32, 2, 7),
      mobile: layout(220, 620, 28, 2, 7),
      style: { background: "#b8832f" },
    },
    {
      id: "hero-meta",
      type: "text",
      name: "PEOPLE MUSIC FURTHER",
      content: "PEOPLE\nMUSIC\nFURTHER",
      desktop: layout(1080, 525, 110, 70, 7),
      mobile: layout(220, 635, 100, 60, 7),
      style: {
        color: "#b88734",
        fontSize: 10,
        lineHeight: 1.45,
        fontWeight: 700,
      },
    },
  ];
}
