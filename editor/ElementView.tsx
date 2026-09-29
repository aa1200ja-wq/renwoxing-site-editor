"use client";

import { motion } from "framer-motion";
import type { SiteElement, ViewportMode } from "./model";
import { motionProps } from "./animation";

type Props = {
  element: SiteElement;
  viewport: ViewportMode;
  editable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

export function ElementView({ element, viewport, editable = false, selected = false, onSelect }: Props) {
  const layout = element[viewport];
  if (!layout.visible) return null;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: layout.x,
    top: layout.y,
    width: layout.width,
    height: layout.height,
    zIndex: layout.zIndex,
    transform: "rotate(" + layout.rotation + "deg)",
    boxSizing: "border-box",
    ...element.style,
  };

  return (
    <motion.div
      data-editor-element={editable ? "true" : undefined}
      data-editor-id={editable ? element.id : undefined}
      style={baseStyle}
      className={selected ? "site-element selected" : "site-element"}
      onMouseDown={(event) => {
        if (!editable) return;
        event.stopPropagation();
        onSelect?.(element.id);
      }}
      {...motionProps(element.animation)}
    >
      <ElementContent element={element} />
    </motion.div>
  );
}

function ElementContent({ element }: { element: SiteElement }) {
  if (element.type === "image") return <img src={element.content} alt={element.name} draggable={false} />;
  if (element.type === "youtube") return <iframe src={element.content} title={element.name} allowFullScreen />;
  if (element.type === "button") return <button type="button">{element.content}</button>;
  if (element.type === "line") return <span className="line-element" />;
  return <div className="text-element">{element.content}</div>;
}
