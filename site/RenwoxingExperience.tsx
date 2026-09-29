"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { renwoxingProject } from "@/editor/renwoxing-project";
import { SiteRenderer } from "@/editor/SiteRenderer";
import type {
  SiteElement,
  ViewportMode,
} from "@/editor/model";

function useViewportMode() {
  const [viewport, setViewport] =
    useState<ViewportMode>("desktop");

  useEffect(() => {
    const sync = () => {
      setViewport(
        window.innerWidth <= 760 ? "mobile" : "desktop",
      );
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return viewport;
}

function useFitScale(
  width: number,
  height: number,
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const sync = () => {
      setScale(
        Math.min(
          window.innerWidth / width,
          window.innerHeight / height,
        ),
      );
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [height, width]);

  return scale;
}

export function RenwoxingExperience() {
  const [pageId, setPageId] = useState("home");
  const viewport = useViewportMode();

  const page = useMemo(
    () =>
      renwoxingProject.pages.find(
        (item) => item.id === pageId,
      ) ?? renwoxingProject.pages[0],
    [pageId],
  );

  const size = page.viewport[viewport];
  const scale = useFitScale(size.width, size.height);

  function handleAction(element: SiteElement) {
    if (element.action?.type !== "navigate") return;
    setPageId(element.action.targetPageId);
  }

  return (
    <main className="public-site-shell">
      <AnimatePresence mode="wait">
        <motion.div
          key={page.id}
          className="public-stage-frame"
          style={{
            width: size.width * scale,
            height: size.height * scale,
          }}
          initial={{
            opacity: 0,
            x: page.id === "home" ? -18 : 36,
          }}
          animate={{ opacity: 1, x: 0 }}
          exit={{
            opacity: 0,
            x: page.id === "home" ? -18 : 36,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <SiteRenderer
            page={page}
            viewport={viewport}
            scale={scale}
            transformOrigin="top left"
            className="public-site-stage"
            onAction={handleAction}
          />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
