import type { SiteElement, SitePage, SiteProject } from "./model";
import { sections } from "@/site/scene-data";

const heroBackground = "https://at.adobe.com/ubJdGzxDCypT1UMG";
const bookBackground = "/assets/renwoxing/album-spread.webp";

const layout = (
  x: number,
  y: number,
  width: number,
  height: number,
  zIndex = 3,
) => ({ x, y, width, height, rotation: 0, zIndex, visible: true });

function sharedInnerElements(): SiteElement[] {
  return [
    {
      id: "book-background",
      type: "image",
      name: "書頁底圖",
      content: bookBackground,
      desktop: layout(520, 0, 920, 900, 1),
      mobile: layout(0, 310, 390, 534, 1),
      style: { objectFit: "cover" },
    },
    {
      id: "side-vinyl",
      type: "component",
      name: "左側黑膠",
      content: "vinyl-compact",
      desktop: layout(-80, 170, 560, 560, 2),
      mobile: layout(-115, 70, 300, 300, 2),
    },
    {
      id: "section-nav",
      type: "text",
      name: "上方導覽",
      content: "認識任我行　 活動精選　 人物　 演出邀約　 影片欣賞　 聯絡我們",
      desktop: layout(570, 62, 760, 42, 5),
      mobile: layout(18, 338, 354, 62, 5),
      style: { color: "#3d3022", fontSize: 16, fontWeight: 700 },
    },
    {
      id: "back-home",
      type: "button",
      name: "回到唱片",
      content: "← 回到唱片",
      desktop: layout(1220, 830, 150, 40, 6),
      mobile: layout(220, 790, 145, 38, 6),
      style: { color: "#5e4a32", borderColor: "transparent" },
    },
  ];
}

function sectionVisual(index: number): SiteElement {
  const id = sections[index].id;
  if (id === "events") {
    return {
      id: "section-visual",
      type: "component",
      name: "活動照片",
      content: "activities",
      desktop: layout(820, 610, 540, 230, 5),
      mobile: layout(24, 650, 342, 160, 5),
    };
  }
  if (id === "members") {
    return {
      id: "section-visual",
      type: "component",
      name: "人物輪播",
      content: "members",
      desktop: layout(760, 600, 640, 250, 5),
      mobile: layout(20, 635, 350, 180, 5),
    };
  }

  const content = id === "about"
    ? "任"
    : id === "booking"
      ? "LIVE"
      : id === "video"
        ? "▶"
        : "01 演出邀約\n02 活動合作\n03 社團交流";

  return {
    id: "section-visual",
    type: id === "video" ? "button" : "text",
    name: "章節視覺",
    content,
    desktop: layout(980, 560, 350, 250, 4),
    mobile: layout(70, 650, 260, 150, 4),
    style: {
      color: id === "about" ? "rgba(145,103,49,.14)" : "#986626",
      fontSize: id === "about" ? 210 : 54,
      lineHeight: 1.2,
      fontWeight: 500,
    },
  };
}

function makeInnerPage(index: number): SitePage {
  const section = sections[index];
  return {
    id: section.id,
    name: section.label,
    viewport: {
      desktop: { width: 1440, height: 900 },
      mobile: { width: 390, height: 844 },
    },
    overflow: "hidden",
    background: "#080706",
    elements: [
      ...sharedInnerElements(),
      {
        id: "eyebrow",
        type: "text",
        name: "英文小標",
        content: section.eyebrow,
        desktop: layout(570, 205, 260, 32, 5),
        mobile: layout(24, 420, 180, 26, 5),
        style: { color: "#9f6922", fontSize: 13, letterSpacing: 4, fontWeight: 700 },
      },
      {
        id: "title",
        type: "text",
        name: "主標題",
        content: section.title,
        desktop: layout(570, 250, 650, 250, 5),
        mobile: layout(24, 455, 340, 150, 5),
        style: { color: "#17110c", fontSize: 70, lineHeight: 1.08, fontWeight: 500 },
      },
      {
        id: "body",
        type: "text",
        name: "內文",
        content: section.body,
        desktop: layout(570, 530, 520, 100, 5),
        mobile: layout(24, 595, 340, 72, 5),
        style: { color: "#5f5140", fontSize: 17, lineHeight: 1.8 },
      },
      {
        id: "page-index",
        type: "text",
        name: "頁碼",
        content: "0" + (index + 1),
        desktop: layout(1110, 220, 210, 120, 4),
        mobile: layout(270, 410, 90, 70, 4),
        style: { color: "rgba(132,91,37,.13)", fontSize: 100 },
      },
      sectionVisual(index),
    ],
  };
}

const home: SitePage = {
  id: "home",
  name: "首頁",
  viewport: {
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 },
  },
  overflow: "hidden",
  background: "#070706",
  elements: [
    {
      id: "hero-background",
      type: "image",
      name: "黑金首頁底圖",
      content: heroBackground,
      desktop: layout(0, 0, 1440, 900, 1),
      mobile: layout(0, 0, 390, 844, 1),
      style: { objectFit: "cover" },
    },
    {
      id: "vertical-title",
      type: "text",
      name: "直式任我行",
      content: "任\n我\n行",
      desktop: layout(250, 250, 120, 340, 5),
      mobile: layout(28, 105, 78, 260, 5),
      style: { color: "#f1eadc", fontSize: 82, lineHeight: .92, fontWeight: 700 },
    },
    {
      id: "hero-vinyl",
      type: "component",
      name: "首頁黑膠",
      content: "vinyl",
      desktop: layout(390, 80, 720, 720, 3),
      mobile: layout(35, 210, 330, 330, 3),
    },
    {
      id: "tap-cue",
      type: "component",
      name: "點擊提示",
      content: "tap-cue",
      desktop: layout(930, 620, 180, 210, 7),
      mobile: layout(240, 650, 120, 140, 7),
    },
    {
      id: "hero-tagline",
      type: "text",
      name: "首頁標語",
      content: "把每一段旋律\n刻進值得被記住的時光。",
      desktop: layout(245, 720, 360, 100, 5),
      mobile: layout(24, 730, 220, 80, 5),
      style: { color: "#efe5d4", fontSize: 18, lineHeight: 1.5, fontWeight: 600 },
    },
  ],
};

export const renwoxingProject: SiteProject = {
  id: "renwoxing",
  name: "任我行薩克斯風社",
  pages: [home, ...sections.map((_, index) => makeInnerPage(index))],
};
