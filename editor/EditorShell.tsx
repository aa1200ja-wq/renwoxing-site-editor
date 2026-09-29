"use client";

import { useMemo, useState } from "react";
import type { SiteProject, ViewportMode, ElementLayout } from "./model";
import { SiteRenderer } from "./SiteRenderer";
import { SelectionOverlay } from "./SelectionOverlay";

export function EditorShell({ initialProject }: { initialProject: SiteProject }) {
  const [project, setProject] = useState(initialProject);
  const [pageId, setPageId] = useState(initialProject.pages[0].id);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const page = useMemo(
    () => project.pages.find((item) => item.id === pageId) ?? project.pages[0],
    [pageId, project.pages],
  );

  function patchSelectedLayout(patch: Partial<ElementLayout>) {
    if (!selectedId) return;
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id !== page.id ? item : {
          ...item,
          elements: item.elements.map((element) =>
            element.id !== selectedId ? element : {
              ...element,
              [viewport]: { ...element[viewport], ...patch },
            },
          ),
        },
      ),
    }));
  }

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <strong>{project.name}</strong>
        <div>
          <button onClick={() => setViewport("desktop")}>桌機</button>
          <button onClick={() => setViewport("mobile")}>手機</button>
          <a href="/preview" target="_blank">預覽 Renderer</a>
        </div>
      </header>
      <aside className="editor-sidebar">
        <p className="panel-title">頁面</p>
        {project.pages.map((item) => (
          <button
            key={item.id}
            className={item.id === page.id ? "active" : ""}
            onClick={() => { setPageId(item.id); setSelectedId(null); }}
          >
            {item.name}
          </button>
        ))}
        <p className="panel-title">新增元素</p>
        <span className="muted">文字 / 圖片 / YouTube / 按鈕 / 線條</span>
      </aside>
      <main className="editor-canvas">
        <SiteRenderer page={page} viewport={viewport} editable selectedId={selectedId} onSelect={setSelectedId} />
        <SelectionOverlay selectedId={selectedId} onSelect={setSelectedId} onLayoutChange={patchSelectedLayout} />
      </main>
      <aside className="editor-inspector">
        <p className="panel-title">元素屬性</p>
        <p>{selectedId ?? "尚未選取元素"}</p>
        <span className="muted">後續加入內容、圖層、動畫與裁切控制。</span>
      </aside>
    </div>
  );
}
