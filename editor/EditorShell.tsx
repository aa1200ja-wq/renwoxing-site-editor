"use client";

import { useMemo, useState } from "react";
import type { ElementLayout, SiteProject, ViewportMode } from "./model";
import { InspectorPanel } from "./InspectorPanel";
import { SelectionOverlay } from "./SelectionOverlay";
import { SiteRenderer } from "./SiteRenderer";

export function EditorShell({ initialProject }: { initialProject: SiteProject }) {
  const [project, setProject] = useState(initialProject);
  const [pageId, setPageId] = useState(initialProject.pages[0].id);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const page = useMemo(
    () => project.pages.find((item) => item.id === pageId) ?? project.pages[0],
    [pageId, project.pages],
  );

  const selectedElement = useMemo(
    () => page.elements.find((item) => item.id === selectedId) ?? null,
    [page.elements, selectedId],
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

  function patchSelectedContent(content: string) {
    if (!selectedId) return;
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id !== page.id ? item : {
          ...item,
          elements: item.elements.map((element) =>
            element.id === selectedId ? { ...element, content } : element,
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
          <button
            className={viewport === "desktop" ? "active" : ""}
            onClick={() => { setViewport("desktop"); setSelectedId(null); }}
          >
            桌機
          </button>
          <button
            className={viewport === "mobile" ? "active" : ""}
            onClick={() => { setViewport("mobile"); setSelectedId(null); }}
          >
            手機
          </button>
          <a href="/site" target="_blank">查看正式網站</a>
        </div>
      </header>

      <aside className="editor-sidebar">
        <p className="panel-title">頁面</p>
        {project.pages.map((item) => (
          <button
            key={item.id}
            className={item.id === page.id ? "active" : ""}
            onClick={() => {
              setPageId(item.id);
              setSelectedId(null);
            }}
          >
            {item.name}
          </button>
        ))}
        <p className="panel-title">新增元素</p>
        <span className="muted">文字 / 圖片 / YouTube / 按鈕 / 線條</span>
      </aside>

      <main className="editor-canvas">
        <SiteRenderer
          page={page}
          viewport={viewport}
          editable
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <SelectionOverlay
          selectedId={selectedId}
          onSelect={setSelectedId}
          onLayoutChange={patchSelectedLayout}
        />
      </main>

      <InspectorPanel
        element={selectedElement}
        viewport={viewport}
        onLayoutChange={patchSelectedLayout}
        onContentChange={patchSelectedContent}
      />
    </div>
  );
}
