"use client";

import { useEffect, useState } from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";
import type { ElementLayout } from "./model";

type Props = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onLayoutChange: (patch: Partial<ElementLayout>) => void;
};

export function SelectionOverlay({
  selectedId,
  onSelect,
  onLayoutChange,
}: Props) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const [guidelines, setGuidelines] = useState<HTMLElement[]>([]);
  const [canvasCenter, setCanvasCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!selectedId) {
      setTarget(null);
      setGuidelines([]);
      setCanvasCenter({ x: 0, y: 0 });
      return;
    }

    const selected = document.querySelector<HTMLElement>(
      '[data-editor-id="' + selectedId + '"]',
    );
    const others = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-editor-element='true']",
      ),
    ).filter((element) => element !== selected);

    const stage = selected?.closest<HTMLElement>(".site-stage");
    setTarget(selected);
    setGuidelines(others);
    setCanvasCenter({
      x: stage ? stage.clientWidth / 2 : 0,
      y: stage ? stage.clientHeight / 2 : 0,
    });
  }, [selectedId]);

  return (
    <>
      <Moveable
        target={target}
        draggable
        resizable
        rotatable
        snappable
        origin={false}
        snapThreshold={6}
        snapGap
        snapCenter
        isDisplaySnapDigit={false}
        elementGuidelines={guidelines}
        verticalGuidelines={canvasCenter.x ? [canvasCenter.x] : []}
        horizontalGuidelines={canvasCenter.y ? [canvasCenter.y] : []}
        snapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        elementSnapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        onDrag={({ target, left, top }) => {
          target.style.left = left + "px";
          target.style.top = top + "px";
        }}
        onDragEnd={({ lastEvent }) => {
          if (lastEvent) {
            onLayoutChange({
              x: lastEvent.left,
              y: lastEvent.top,
            });
          }
        }}
        onResize={({ target, width, height, drag }) => {
          target.style.width = width + "px";
          target.style.height = height + "px";
          target.style.left = drag.left + "px";
          target.style.top = drag.top + "px";
        }}
        onResizeEnd={({ lastEvent }) => {
          if (!lastEvent) return;
          onLayoutChange({
            width: lastEvent.width,
            height: lastEvent.height,
            x: lastEvent.drag.left,
            y: lastEvent.drag.top,
          });
        }}
        onRotate={({ target, rotation }) => {
          target.style.transform =
            "rotate(" + rotation + "deg)";
        }}
        onRotateEnd={({ lastEvent }) => {
          if (lastEvent) {
            onLayoutChange({
              rotation: lastEvent.rotation,
            });
          }
        }}
      />

      <Selecto
        dragContainer=".editor-canvas"
        selectableTargets={[
          "[data-editor-element='true']",
        ]}
        hitRate={20}
        selectByClick
        selectFromInside={false}
        continueSelect={false}
        onSelectEnd={({ selected }) => {
          const id =
            selected[0]?.getAttribute(
              "data-editor-id",
            ) ?? null;
          onSelect(id);
        }}
      />
    </>
  );
}
