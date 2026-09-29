"use client";

import { useEffect, useMemo, useState } from "react";
import { createElement, type AddableElementType } from "./element-factory";
import { EditorSidebar } from "./EditorSidebar";
import { InspectorPanel } from "./InspectorPanel";
import type { ElementLayout, SiteProject, ViewportMode } from "./model";
import { loadDraft, persistProject } from "./project-storage";
import { SelectionOverlay } from "./SelectionOverlay";
import { SiteRenderer } from "./SiteRenderer";

export function EditorShell({ initialProject }: { initialProject: SiteProject }) {
  const [project, setProject] = useState(initialProject);
  const [pageId, setPageId] = useState(initialProject.pages[0].id);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState("尚未儲存");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDraft().then((draft) => {
      if (!draft) return;
      setProject(draft);
      setPageId(draft.pages[0].id);
      setSaveState("已載入草稿");
    });
  }, []);

  const page = useMemo(
    () => project.pages.find((item) => item.id === pageId) ?? project.pages[0],
    [pageId, project.pages],
  );

  const selectedElement = useMemo(
    () => page.elements.find((item) => item.id === selectedId) ?? null,
    [page.elements, selectedId],
  );

  function updateCurrentPage(
    updater: (elements: typeof page.elements) => typeof page.elements,
  ) {
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id === page.id ? { ...item, elements: updater(item.elements) } : item,
      ),
    }));
  }

  function patchSelectedLayout(patch: Partial<ElementLayout>) {
    if (!selectedId) return;
    updateCurrentPage((elements) =>
      elements.map((element) =>
        element.id === selectedId
          ? { ...element, [viewport]: { ...element[viewport], ...patch } }
          : element,
      ),
    );
  }

  function patchSelectedContent(content: string) {
    if (!selectedId) return;
    updateCurrentPage((elements) =>
      elements.map((element) =>
        element.id === selectedId ? { ...element, content } : element,
      ),
    );
  }

  function patchSelectedStyle(patch: Record<string, string | number>) {
    if (!selectedId) return;
    const styleKey = viewport === "desktop" ? "desktopStyle" : "mobileStyle";
    updateCurrentPage((elements) =>
      elements.map((element) =>
        element.id === selectedId
          ? { ...element, [styleKey]: { ...element[styleKey], ...patch } }
          : element,
      ),
    );
  }

  function patchSelectedSetting(
    patch: Record<string, string | number | boolean>,
  ) {
    if (!selectedId) return;
    updateCurrentPage((elements) =>
      elements.map((element) =>
        element.id === selectedId
          ? {
              ...element,
              settings: {
                ...element.settings,
                [viewport]: {
                  ...element.settings?.[viewport],
                  ...patch,
                },
              },
            }
          : element,
      ),
    );
  }

  function addElement(type: AddableElementType) {
    const element = createElement(type, page);
    updateCurrentPage((elements) => [...elements, element]);
    setSelectedId(element.id);
  }

  function deleteSelectedElement() {
    if (!selectedId) return;
    updateCurrentPage((elements) =>
      elements.filter((element) => element.id !== selectedId),
    );
    setSelectedId(null);
  }

  async function save(action: "save" | "publish") {
    setSaving(true);
    setSaveState(action === "publish" ? "發布中…" : "儲存中…");
    try {
      const result = await persistProject(project, action);
      if (result.cancelled) {
        setSaveState("已取消");
      } else {
        setSaveState(action === "publish" ? "已發布" : "草稿已儲存");
      }
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "儲存失敗");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <strong>{project.name}</strong>
        <div>
          <span className="save-status">{saveState}</span>
          <button disabled={saving} onClick={() => save("save")}>
            儲存草稿
          </button>
          <button disabled={saving} onClick={() => save("publish")}>
            儲存並發布
          </button>
          <button
            className={viewport === "desktop" ? "active" : ""}
            onClick={() => {
              setViewport("desktop");
              setSelectedId(null);
            }}
          >
            桌機
          </button>
          <button
            className={viewport === "mobile" ? "active" : ""}
            onClick={() => {
              setViewport("mobile");
              setSelectedId(null);
            }}
          >
            手機
          </button>
          <a href="/site" target="_blank">查看正式網站</a>
        </div>
      </header>

      <EditorSidebar
        project={project}
        page={page}
        selectedId={selectedId}
        onPageChange={(nextPageId) => {
          setPageId(nextPageId);
          setSelectedId(null);
        }}
        onElementSelect={setSelectedId}
        onAddElement={addElement}
      />

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
        onStyleChange={patchSelectedStyle}
        onSettingChange={patchSelectedSetting}
        onDelete={deleteSelectedElement}
      />
    </div>
  );
}
