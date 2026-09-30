"use client";

import type { AddableElementType } from "./element-factory";
import type { SitePage, SiteProject } from "./model";
import "./inner-page-sync.css";

type Props = {
  project: SiteProject;
  page: SitePage;
  selectedId: string | null;
  onPageChange: (pageId: string) => void;
  onElementSelect: (elementId: string) => void;
  onAddElement: (type: AddableElementType) => void;
  innerSyncAvailable: boolean;
  syncInnerPages: boolean;
  onSyncInnerPagesChange: (enabled: boolean) => void;
  onApplyInnerTemplate: () => void;
};

const addButtons: Array<{
  type: AddableElementType;
  label: string;
}> = [
  { type: "text", label: "＋ 文字" },
  { type: "image", label: "＋ 圖片" },
  { type: "youtube", label: "＋ YouTube" },
  { type: "button", label: "＋ 按鈕" },
  { type: "line", label: "＋ 線條" },
];

export function EditorSidebar({
  project,
  page,
  selectedId,
  onPageChange,
  onElementSelect,
  onAddElement,
  innerSyncAvailable,
  syncInnerPages,
  onSyncInnerPagesChange,
  onApplyInnerTemplate,
}: Props) {
  return (
    <aside className="editor-sidebar">
      <p className="panel-title">頁面</p>
      <div className="sidebar-section">
        {project.pages.map((item) => (
          <button
            key={item.id}
            className={item.id === page.id ? "active" : ""}
            onClick={() => onPageChange(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>

      {innerSyncAvailable && (
        <div className="inner-sync-box">
          <label>
            <input
              type="checkbox"
              checked={syncInnerPages}
              onChange={(event) =>
                onSyncInnerPagesChange(event.target.checked)
              }
            />
            <strong>六個內頁連動</strong>
          </label>
          <small>
            共用版型的位置、尺寸、字級與顯示狀態會同步；各頁文字內容保留。
          </small>
          <button type="button" onClick={onApplyInnerTemplate}>
            套用本頁共用版型到其他五頁
          </button>
        </div>
      )}

      <p className="panel-title">所有元素</p>
      <div className="element-list">
        {page.elements.map((element, index) => (
          <button
            key={element.id}
            className={element.id === selectedId ? "active" : ""}
            onClick={() => onElementSelect(element.id)}
            title={element.name}
          >
            <span className="element-order">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="element-name">{element.name}</span>
            <small>{element.type}</small>
          </button>
        ))}
      </div>

      <p className="panel-title">新增元素</p>
      <div className="add-element-grid">
        {addButtons.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAddElement(item.type)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
