import React, { useRef, useState, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const PREVIEW_SIZE = 240;
const GAP = 8;
const PAD = 12;

function supportsHoverPreview() {
  return window.matchMedia('(hover: hover)').matches;
}

function computePreviewPosition(rect) {
  let top = rect.top - PREVIEW_SIZE - GAP;
  let left = rect.left + rect.width / 2 - PREVIEW_SIZE / 2;

  if (top < PAD) {
    top = rect.bottom + GAP;
  }

  if (left < PAD) {
    left = PAD;
  }
  if (left + PREVIEW_SIZE > window.innerWidth - PAD) {
    left = window.innerWidth - PREVIEW_SIZE - PAD;
  }

  return {
    top,
    left,
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
  };
}

function PortfolioItem({ image, onOpen }) {
  const itemRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const isHoveredRef = useRef(false);
  const rafRef = useRef(null);

  const updatePreview = useCallback(() => {
    if (!itemRef.current || !isHoveredRef.current || !supportsHoverPreview()) {
      return;
    }
    const rect = itemRef.current.getBoundingClientRect();
    setPreview(computePreviewPosition(rect));
  }, []);

  const handleMouseEnter = () => {
    if (!supportsHoverPreview()) return;
    isHoveredRef.current = true;
    updatePreview();
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    setPreview(null);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const handleScrollOrResize = useCallback(() => {
    if (!isHoveredRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updatePreview();
    });
  }, [updatePreview]);

  useLayoutEffect(() => {
    if (!preview) return;

    const scrollParent = itemRef.current?.closest('.content');

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    scrollParent?.addEventListener('scroll', handleScrollOrResize);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      scrollParent?.removeEventListener('scroll', handleScrollOrResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [preview, handleScrollOrResize]);

  return (
    <>
      <div
        ref={itemRef}
        className="portfolio-item"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onOpen}
      >
        <img src={image.media_url} alt={image.caption || ''} />
      </div>

      {preview &&
        createPortal(
          <div
            className="portfolio-hover-preview"
            style={{
              top: preview.top,
              left: preview.left,
              width: preview.width,
              height: preview.height,
            }}
          >
            <img src={image.media_url} alt="" />
          </div>,
          document.body
        )}
    </>
  );
}

export default PortfolioItem;
