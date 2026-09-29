"use client";

import type {
  SiteElement,
  SitePage,
  ViewportMode,
} from "./model";
import { ElementView } from "./ElementView";

type Props = {
  page: SitePage;
  viewport: ViewportMode;
  editable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onAction?: (element: SiteElement) => void;
  scale?: number;
  transformOrigin?: string;
  className?: string;
};

export function SiteRenderer({
  page,
  viewport,
  editable = false,
  selectedId,
  onSelect,
  onAction,
  scale,
  transformOrigin = "center center",
  className = "",
}: Props) {
  const size = page.viewport[viewport];
  const resolvedScale =
    scale ?? (viewport === "mobile" ? 0.84 : 0.72);

  return (
    <div
      className={`site-stage ${className}`.trim()}
      style={{
        width: size.width,
        height: size.height,
        background: page.background,
        overflow: page.overflow,
        transform: "scale(" + resolvedScale + ")",
        transformOrigin,
      }}
      onMouseDown={() => editable && onSelect?.(null)}
    >
      {page.elements.map((element) => (
        <ElementView
          key={element.id}
          element={element}
          viewport={viewport}
          editable={editable}
          selected={selectedId === element.id}
          onSelect={onSelect ?? undefined}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
