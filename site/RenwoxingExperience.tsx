"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { renwoxingProject } from "@/editor/renwoxing-project";
import { SiteRenderer } from "@/editor/SiteRenderer";
import type {
  SiteElement,
  ViewportMode,
} from "@/editor/model";
import { ImageLightbox } from "./ImageLightbox";
import "./image-lightbox.css";

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

const pageTransition = {
  initial: {
    opacity: 0.25,
    x: -110,
    rotateY: -16,
    clipPath: "inset(0 100% 0 0)",
  },
  animate: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    clipPath: "inset(0 0% 0 0)",
  },
  exit: {
    opacity: 0.45,
    x: 55,
    rotateY: 8,
    clipPath: "inset(0 0 0 22%)",
  },
};

export function RenwoxingExperience() {
  const [pageId, setPageId] = useState("home");
  const [lightboxSrc, setLightboxSrc] =
    useState<string | null>(null);
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
    if (!element.action) return;

    if (element.action.type === "navigate") {
      setPageId(element.action.targetPageId);
      return;
    }

    if (element.action.type === "lightbox") {
      setLightboxSrc(element.content);
    }
  }

  return (
    <main className="public-site-shell book-perspective">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={page.id}
          className="public-stage-frame book-page-turn"
          style={{
            width: size.width * scale,
            height: size.height * scale,
          }}
          initial={pageTransition.initial}
          animate={pageTransition.animate}
          exit={pageTransition.exit}
          transition={{
            duration: 0.82,
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
          <motion.span
            className="book-page-shadow"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      <ImageLightbox
        src={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </main>
  );
}
