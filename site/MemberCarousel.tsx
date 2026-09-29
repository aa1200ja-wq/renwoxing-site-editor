"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { members, type Member } from "./member-data";
import "./member-carousel.css";

export function MemberCarousel({
  embedded = false,
  speedSeconds = 38,
}: {
  embedded?: boolean;
  speedSeconds?: number;
}) {
  const [selected, setSelected] = useState<Member | null>(null);
  const loopMembers = [...members, ...members];

  const modal = (
    <AnimatePresence>
      {selected && (
        <motion.div
          className="member-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelected(null)}
        >
          <motion.article
            className="member-modal"
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="member-modal-close"
              onClick={() => setSelected(null)}
              aria-label="關閉人物卡片"
            >
              ×
            </button>
            <img
              className="member-alt-photo"
              src={selected.detail}
              alt={selected.name}
            />
            <p>{selected.role}</p>
            <h3>{selected.name}</h3>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        className={
          embedded
            ? "member-carousel embedded"
            : "member-carousel"
        }
        aria-label="十位人物慢速輪播"
      >
        <div
          className="member-track"
          style={{ animationDuration: speedSeconds + "s" }}
        >
          {loopMembers.map((member, index) => (
            <button
              type="button"
              className="member-card"
              key={`${member.id}-${index}`}
              onClick={() => setSelected(member)}
            >
              <img
                src={member.cover}
                alt={member.name}
              />
              <span>
                {String(member.id).padStart(2, "0")}
              </span>
              <div className="member-card-copy">
                <strong>{member.name}</strong>
                <small>{member.role}</small>
              </div>
            </button>
          ))}
        </div>
      </div>

      {typeof document !== "undefined"
        ? createPortal(modal, document.body)
        : null}
    </>
  );
}
