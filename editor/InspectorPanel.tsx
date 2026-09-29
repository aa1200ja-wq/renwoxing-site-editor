"use client";

import type { ElementLayout, SiteElement, ViewportMode } from "./model";

type Props = {
  element: SiteElement | null;
  viewport: ViewportMode;
  onLayoutChange: (patch: Partial<ElementLayout>) => void;
  onContentChange: (content: string) => void;
  onStyleChange: (patch: Record<string, string | number>) => void;
  onSettingChange: (
    patch: Record<string, string | number | boolean>,
  ) => void;
  onDelete: () => void;
};

const numericFields: Array<{
  key: keyof Pick<
    ElementLayout,
    "x" | "y" | "width" | "height" | "rotation" | "zIndex"
  >;
  label: string;
}> = [
  { key: "x", label: "X" },
  { key: "y", label: "Y" },
  { key: "width", label: "寬" },
  { key: "height", label: "高" },
  { key: "rotation", label: "旋轉" },
  { key: "zIndex", label: "圖層" },
];

function contentLabel(element: SiteElement) {
  if (element.type === "image") return "圖片網址";
  if (element.type === "youtube") return "YouTube Embed 網址";
  return "文字內容";
}

export function InspectorPanel({
  element,
  viewport,
  onLayoutChange,
  onContentChange,
  onStyleChange,
  onSettingChange,
  onDelete,
}: Props) {
  if (!element) {
    return (
      <aside className="editor-inspector">
        <p className="panel-title">元素屬性</p>
        <p>尚未選取元素</p>
        <span className="muted">
          點畫布或左側「所有元素」即可選取。
        </span>
      </aside>
    );
  }

  const activeLayout = element[viewport];
  const editableContent = [
    "text",
    "button",
    "image",
    "youtube",
  ].includes(element.type);
  const editableTypography =
    element.type === "text" || element.type === "button";
  const viewportStyle =
    viewport === "desktop"
      ? element.desktopStyle
      : element.mobileStyle;
  const fontSize = Number(
    viewportStyle?.fontSize ?? element.style?.fontSize ?? 16,
  );
  const isMemberCarousel =
    element.type === "component" &&
    element.content === "members";
  const carouselSpeed = Number(
    element.settings?.[viewport]?.speed ??
      (viewport === "mobile" ? 120 : 42),
  );

  return (
    <aside className="editor-inspector">
      <p className="panel-title">元素屬性</p>
      <strong>{element.name}</strong>
      <span className="muted">
        {viewport === "desktop" ? "桌機版" : "手機版"}
      </span>

      <div className="inspector-grid">
        {numericFields.map(({ key, label }) => (
          <label key={key}>
            <span>{label}</span>
            <input
              type="number"
              value={activeLayout[key]}
              onChange={(event) =>
                onLayoutChange({
                  [key]: Number(event.target.value),
                })
              }
            />
          </label>
        ))}
      </div>

      {editableTypography && (
        <label className="content-field">
          <span>
            字體大小（{viewport === "desktop" ? "桌機" : "手機"}）
          </span>
          <input
            type="number"
            min="6"
            max="300"
            value={fontSize}
            onChange={(event) =>
              onStyleChange({
                fontSize: Number(event.target.value),
              })
            }
          />
        </label>
      )}

      {isMemberCarousel && (
        <label className="content-field">
          <span>
            輪播秒數（{viewport === "desktop" ? "桌機" : "手機"}）
          </span>
          <input
            type="number"
            min="10"
            max="240"
            value={carouselSpeed}
            onChange={(event) =>
              onSettingChange({
                speed: Number(event.target.value),
              })
            }
          />
        </label>
      )}

      <label className="visible-toggle">
        <input
          type="checkbox"
          checked={activeLayout.visible}
          onChange={(event) =>
            onLayoutChange({ visible: event.target.checked })
          }
        />
        <span>顯示此元素</span>
      </label>

      {editableContent && (
        <label className="content-field">
          <span>{contentLabel(element)}</span>
          <textarea
            value={element.content}
            onChange={(event) =>
              onContentChange(event.target.value)
            }
            rows={5}
          />
        </label>
      )}

      <button
        type="button"
        className="delete-element"
        onClick={onDelete}
      >
        刪除元素
      </button>
      <span className="muted">
        步驟5尚未儲存前，重新整理頁面可還原。
      </span>
    </aside>
  );
}
