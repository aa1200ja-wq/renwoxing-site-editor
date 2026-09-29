"use client";

import { useMemo, useState } from "react";
import { createElement, type AddableElementType } from "./element-factory";
import { EditorSidebar } from "./EditorSidebar";
import { InspectorPanel } from "./InspectorPanel";
import type {
  ElementLayout,
  SiteProject,
  ViewportMode,
} from "./model";
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
        item.id !== page.id
          ? item
          : {
              ...item,
              elements: item.elements.map((element) =>
                element.id !== selectedId
                  ? element
                  : {
                      ...element,
                      [viewport]: {
                        ...element[viewport],
                        ...patch,
                      },
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
        item.id !== page.id
          ? item
          : {
              ...item,
              elements: item.elements.map((element) =>
                element.id === selectedId
                  ? { ...element, content }
                  : element,
              ),
            },
      ),
    }));
  }

  function patchSelectedStyle(
    patch: Record<string, string | number>,
  ) {
    if (!selectedId) return;
    const styleKey =
      viewport === "desktop" ? "desktopStyle" : "mobileStyle";

    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id !== page.id
          ? item
          : {
              ...item,
              elements: item.elements.map((element) =>
                element.id === selectedId
                  ? {
                      ...element,
                      [styleKey]: {
                        ...element[styleKey],
                        ...patch,
                      },
                    }
                  : element,
              ),
            },
      ),
    }));
  }

  function patchSelectedSetting(
    patch: Record<string, string | number | boolean>,
  ) {
    if (!selectedId) return;

    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id !== page.id
          ? item
          : {
              ...item,
              elements: item.elements.map((element) =>
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
            },
      ),
    }));
  }

  function addElement(type: AddableElementType) {
    const element = createElement(type, page);
    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id === page.id
          ? { ...item, elements: [...item.elements, element] }
          : item,
      ),
    }));
    setSelectedId(element.id);
  }

  function deleteSelectedElement() {
    if (!selectedId) return;

    setProject((current) => ({
      ...current,
      pages: current.pages.map((item) =>
        item.id === page.id
          ? {
              ...item,
              elements: item.elements.filter(
                (element) => element.id !== selectedId,
              ),
            }
          : item,
      ),
    }));
    setSelectedId(null);
  }

  return (
    <div className="editor-shell">
      <header className="editor-topbar">
        <strong>{project.name}</strong>
        <div>
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
