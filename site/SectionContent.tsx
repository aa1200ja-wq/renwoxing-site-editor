"use client";

import type { SectionId } from "./scene-data";
import "./section-content.css";
import { MemberCarousel } from "./MemberCarousel";

export function SectionContent({ section }: { section: SectionId }) {
  if (section === "about") return <AboutVisual />;
  if (section === "events") return <EventsVisual />;
  if (section === "members") return <MembersVisual />;
  if (section === "booking") return <BookingVisual />;
  if (section === "video") return <VideoVisual />;
  return <ContactVisual />;
}

function AboutVisual() {
  return (
    <div className="about-visual">
      <div className="big-number">任</div>
      <div className="about-lines">
        <span />
        <span />
        <span />
      </div>
      <p>PEOPLE · MUSIC · FURTHER</p>
    </div>
  );
}

function EventsVisual() {
  const events = [
    { label: "LIVE", image: "/assets/renwoxing/activity-01.webp" },
    { label: "SESSION", image: "/assets/renwoxing/activity-02.webp" },
    { label: "MEMORY", image: "/assets/renwoxing/activity-03.webp" },
  ];

  return (
    <div className="event-grid">
      {events.map((event, index) => (
        <div className="event-tile" key={event.label}>
          <img src={event.image} alt="任我行活動紀錄" />
          <span>0{index + 1}</span>
          <div className="event-copy">
            <strong>{event.label}</strong>
            <small>任我行活動紀錄</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function MembersVisual() {
  return <MemberCarousel />;
}

function BookingVisual() {
  return (
    <div className="booking-visual">
      <span className="booking-ring" />
      <span className="booking-ring inner" />
      <strong>LIVE</strong>
      <small>SAXOPHONE ENSEMBLE</small>
    </div>
  );
}

function VideoVisual() {
  return (
    <div className="video-frame">
      <button type="button" aria-label="播放影片">▶</button>
      <span>FEATURED PERFORMANCE</span>
    </div>
  );
}

function ContactVisual() {
  return (
    <div className="contact-lines">
      <p><span>01</span> 演出邀約</p>
      <p><span>02</span> 活動合作</p>
      <p><span>03</span> 社團交流</p>
    </div>
  );
}
