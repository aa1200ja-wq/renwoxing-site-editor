"use client";

import { useEffect, useMemo, useState } from "react";
import { createElement, type AddableElementType } from "./element-factory";
import { EditorSidebar } from "./EditorSidebar";
import { InspectorPanel } from "./InspectorPanel";
import {
  applyInnerTemplate,
  canSyncInnerElement,
  isInnerPage,
  shouldSyncInnerContent,
} from "./inner-page-sync";
import type {
  ComponentData,
  ElementLayout,
  SiteElement,
  SiteProject,
  ViewportMode,
} from "./model";
import { loadDraft, persistProject } from "./project-storage";
import { SelectionOverlay } from "./SelectionOverlay";
import { SiteRenderer } from "./SiteRenderer";

export function EditorShell({ initialProject }: { initialProject: SiteProject }) {
  const [project, setProject] = useState(initialProject);
  const [pageId, setPageId] = useState(initialProject.pages[0].id);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [syncInnerPages, setSyncInnerPages] = useState(false);
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

  function updateSelected(
    updater: (element: SiteElement) => SiteElement,
    allowSync = true,
  ) {
    if (!selectedId) return;
    const sync =
      allowSync &&
      syncInnerPages &&
      canSyncInnerElement(page.id, selectedId);

    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) => {
        const matchesPage =
          item.id === page.id || (sync && isInnerPage(item.id));
        if (!matchesPage) return item;
        return {
          ...item,
          elements: item.elements.map((element) =>
            element.id === selectedId ? updater(element) : element,
          ),
        };
      }),
    }));
  }

  function patchSelectedLayout(patch: Partial<ElementLayout>) {
    updateSelected((element) => ({
      ...element,
      [viewport]: { ...element[viewport], ...patch },
    }));
  }

  function patchSelectedContent(content: string) {
    updateSelected(
      (element) => ({ ...element, content }),
      shouldSyncInnerContent(page.id, selectedId),
    );
  }

  function patchSelectedStyle(patch: Record<string, string | number>) {
    const styleKey = viewport === "desktop" ? "desktopStyle" : "mobileStyle";
    updateSelected((element) => ({
      ...element,
      [styleKey]: { ...element[styleKey], ...patch },
    }));
  }

  function patchSelectedSetting(
    patch: Record<string, string | number | boolean>,
  ) {
    updateSelected((element) => ({
      ...element,
      settings: {
        ...element.settings,
        [viewport]: { ...element.settings?.[viewport], ...patch },
      },
    }));
  }

  function patchComponentData(componentData: ComponentData) {
    updateSelected(
      (element) => ({ ...element, componentData }),
      false,
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

  function applyCurrentTemplate() {
    setProject((current) => applyInnerTemplate(current, page.id));
    setSaveState("六個內頁版型已同步，尚未儲存");
  }

  async function save(action: "save" | "publish") {
    setSaving(true);
    setSaveState(action === "publish" ? "發布中…" : "儲存中…");
    try {
      const result = await persistProject(project, action);
      setSaveState(
        result.cancelled
          ? "已取消"
          : action === "publish"
            ? "已發布"
            : "草稿已儲存",
      );
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
        innerSyncAvailable={isInnerPage(page.id)}
        syncInnerPages={syncInnerPages}
        onSyncInnerPagesChange={setSyncInnerPages}
        onApplyInnerTemplate={applyCurrentTemplate}
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
        onComponentDataChange={patchComponentData}
        onDelete={deleteSelectedElement}
      />
    </div>
  );
}
