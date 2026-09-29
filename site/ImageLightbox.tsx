"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  src: string | null;
  onClose: () => void;
};

export function ImageLightbox({ src, onClose }: Props) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="site-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="活動照片放大檢視"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            className="site-lightbox"
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="site-lightbox-close"
              onClick={onClose}
              aria-label="關閉活動照片"
            >
              ×
            </button>
            <img src={src} alt="任我行活動紀錄放大照片" />
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
