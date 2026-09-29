export type SectionId =
  | "about"
  | "events"
  | "members"
  | "booking"
  | "video"
  | "contact";

export const sections: Array<{
  id: SectionId;
  label: string;
  eyebrow: string;
  title: string;
  body: string;
}> = [
  {
    id: "about",
    label: "認識任我行",
    eyebrow: "ABOUT US",
    title: "讓每一段旋律，都有自己的方向。",
    body: "任我行薩克斯風社，以音樂相聚，也以舞台記錄彼此的故事。",
  },
  {
    id: "events",
    label: "活動精選",
    eyebrow: "EVENTS",
    title: "把值得記住的時刻，留在聲音裡。",
    body: "演出、聚會與交流活動，會在這裡留下完整紀錄。",
  },
  {
    id: "members",
    label: "人物",
    eyebrow: "PEOPLE",
    title: "十個角色，組成同一段聲音。",
    body: "九位團員與一位指導老師。人物照片完成後會接進這一頁。",
  },
  {
    id: "booking",
    label: "演出邀約",
    eyebrow: "BOOKING",
    title: "讓薩克斯風，走進你的下一個現場。",
    body: "舞台、活動與合作邀約，可在此查看演出資訊與聯絡方式。",
  },
  {
    id: "video",
    label: "影片欣賞",
    eyebrow: "WATCH",
    title: "旋律不只被聽見，也值得被看見。",
    body: "演出影片與精選片段會集中在這個章節。",
  },
  {
    id: "contact",
    label: "聯絡我們",
    eyebrow: "CONTACT",
    title: "下一段旋律，從一個訊息開始。",
    body: "合作、演出與交流需求，可透過聯絡資訊與任我行聯繫。",
  },
];
