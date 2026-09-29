"use client";

import type { SitePage, ViewportMode } from "./model";
import { ElementView } from "./ElementView";

type Props = {
  page: SitePage;
  viewport: ViewportMode;
  editable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
};

export function SiteRenderer({ page, viewport, editable = false, selectedId, onSelect }: Props) {
  const scale = viewport === "mobile" ? 0.62 : 0.72;
  return (
    <div
      className="site-stage"
      style={{
        width: page.width,
        height: page.height,
        background: page.background,
        overflow: page.overflow,
        transform: "scale(" + scale + ")",
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
        />
      ))}
    </div>
  );
}
