"use client";

import type { ElementLayout, SiteElement, ViewportMode } from "./model";

type Props = {
  element: SiteElement | null;
  viewport: ViewportMode;
  onLayoutChange: (patch: Partial<ElementLayout>) => void;
  onContentChange: (content: string) => void;
};

const numericFields: Array<{
  key: keyof Pick<ElementLayout, "x" | "y" | "width" | "height" | "rotation" | "zIndex">;
  label: string;
}> = [
  { key: "x", label: "X" },
  { key: "y", label: "Y" },
  { key: "width", label: "寬" },
  { key: "height", label: "高" },
  { key: "rotation", label: "旋轉" },
  { key: "zIndex", label: "圖層" },
];

export function InspectorPanel({
  element,
  viewport,
  onLayoutChange,
  onContentChange,
}: Props) {
  if (!element) {
    return (
      <aside className="editor-inspector">
        <p className="panel-title">元素屬性</p>
        <p>尚未選取元素</p>
        <span className="muted">點畫布上的元素即可調整。</span>
      </aside>
    );
  }

  const activeLayout = element[viewport];
  const editableContent = element.type === "text" || element.type === "button";

  return (
    <aside className="editor-inspector">
      <p className="panel-title">元素屬性</p>
      <strong>{element.name}</strong>
      <span className="muted">{viewport === "desktop" ? "桌機版" : "手機版"}</span>

      <div className="inspector-grid">
        {numericFields.map(({ key, label }) => (
          <label key={key}>
            <span>{label}</span>
            <input
              type="number"
              value={activeLayout[key]}
              onChange={(event) =>
                onLayoutChange({ [key]: Number(event.target.value) })
              }
            />
          </label>
        ))}
      </div>

      <label className="visible-toggle">
        <input
          type="checkbox"
          checked={activeLayout.visible}
          onChange={(event) => onLayoutChange({ visible: event.target.checked })}
        />
        <span>顯示此元素</span>
      </label>

      {editableContent && (
        <label className="content-field">
          <span>文字內容</span>
          <textarea
            value={element.content}
            onChange={(event) => onContentChange(event.target.value)}
            rows={5}
          />
        </label>
      )}
    </aside>
  );
}
