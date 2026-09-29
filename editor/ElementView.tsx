"use client";

import { motion } from "framer-motion";
import type { SiteElement, ViewportMode } from "./model";
import { motionProps } from "./animation";
import { SpecialElement } from "./SpecialElement";

type Props = {
  element: SiteElement;
  viewport: ViewportMode;
  editable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
  onAction?: (element: SiteElement) => void;
};

export function ElementView({
  element,
  viewport,
  editable = false,
  selected = false,
  onSelect,
  onAction,
}: Props) {
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
    cursor: !editable && element.action ? "pointer" : undefined,
    ...element.style,
    ...(viewport === "desktop"
      ? element.desktopStyle
      : element.mobileStyle),
  };

  return (
    <div
      data-editor-element={editable ? "true" : undefined}
      data-editor-id={editable ? element.id : undefined}
      style={baseStyle}
      className={selected ? "site-element selected" : "site-element"}
      onMouseDown={(event) => {
        if (!editable) return;
        event.stopPropagation();
        onSelect?.(element.id);
      }}
      onClick={() => {
        if (editable || !element.action) return;
        onAction?.(element);
      }}
    >
      <motion.div
        className="site-element-motion"
        {...motionProps(element.animation)}
      >
        <ElementContent
          element={element}
          viewport={viewport}
        />
      </motion.div>
    </div>
  );
}

function ElementContent({
  element,
  viewport,
}: {
  element: SiteElement;
  viewport: ViewportMode;
}) {
  if (element.type === "image") {
    return (
      <img
        src={element.content}
        alt={element.name}
        draggable={false}
      />
    );
  }

  if (element.type === "youtube") {
    return (
      <iframe
        src={element.content}
        title={element.name}
        allowFullScreen
      />
    );
  }

  if (element.type === "button") {
    return <button type="button">{element.content}</button>;
  }

  if (element.type === "line") {
    return <span className="line-element" />;
  }

  if (element.type === "component") {
    return (
      <SpecialElement
        name={element.content}
        viewport={viewport}
        settings={element.settings?.[viewport]}
      />
    );
  }

  return <div className="text-element">{element.content}</div>;
}
