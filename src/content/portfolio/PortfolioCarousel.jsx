import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { ModalContext } from '../../utils/modalContext';
import InquireForm from './InquireForm';

const SCALE_FACTOR = 0.7;
const SPACING_CQW = 30;
const TRANSITION_MS = 350;
const SWIPE_THRESHOLD = 50;

function getSlideStyle(offset, visibleRadius) {
  const absOffset = Math.abs(offset);
  const scale = SCALE_FACTOR ** absOffset;
  const translateX = offset * SPACING_CQW;
  const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.55 : 0.25;
  const zIndex = visibleRadius - absOffset;

  return {
    transform: `translate(-50%, -50%) translateX(${translateX}cqw) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: offset === 0 ? 'none' : 'auto',
    transition: `transform ${TRANSITION_MS}ms ease, opacity ${TRANSITION_MS}ms ease`,
  };
}

function getCaption(image) {
  if (image.media_type === 'CAROUSEL_ALBUM' && image.children?.[0]?.caption) {
    return image.children[0].caption;
  }
  return image.caption || '';
}

function PortfolioCarousel({ images, startIndex = 0 }) {
  const { openModal } = useContext(ModalContext);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [visibleRadius, setVisibleRadius] = useState(2);
  const [ratios, setRatios] = useState({});
  const transitionTimerRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const pointerStartRef = useRef(null);
  const wasSwipingRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const update = () => setVisibleRadius(mq.matches ? 1 : 2);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handleImageLoad = useCallback((imageId, event) => {
    const { naturalWidth, naturalHeight } = event.target;
    if (!naturalWidth || !naturalHeight) return;
    const ratio = naturalWidth / naturalHeight;
    setRatios((prev) => (prev[imageId] === ratio ? prev : { ...prev, [imageId]: ratio }));
  }, []);

  const navigate = useCallback(
    (compute) => {
      if (isTransitioningRef.current) return;
      setActiveIndex((current) => {
        const target = Math.max(0, Math.min(images.length - 1, compute(current)));
        if (target === current) return current;
        isTransitioningRef.current = true;
        if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = setTimeout(() => {
          isTransitioningRef.current = false;
          transitionTimerRef.current = null;
        }, TRANSITION_MS);
        return target;
      });
    },
    [images.length]
  );

  const goPrev = useCallback(() => navigate((c) => c - 1), [navigate]);
  const goNext = useCallback(() => navigate((c) => c + 1), [navigate]);
  const goTo = useCallback((index) => navigate(() => index), [navigate]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  const handlePointerDown = useCallback((event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
  }, []);

  const handlePointerUp = useCallback(
    (event) => {
      const start = pointerStartRef.current;
      if (!start || start.id !== event.pointerId) return;
      pointerStartRef.current = null;

      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;

      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        wasSwipingRef.current = true;
        setTimeout(() => {
          wasSwipingRef.current = false;
        }, 0);
        if (dx < 0) goNext();
        else goPrev();
      }
    },
    [goPrev, goNext]
  );

  const handlePointerCancel = useCallback(() => {
    pointerStartRef.current = null;
  }, []);

  const handleSlideClick = useCallback(
    (index, isActive) => {
      if (wasSwipingRef.current) return;
      if (!isActive) goTo(index);
    },
    [goTo]
  );

  const activeImage = images[activeIndex];
  const activeCaption = activeImage ? getCaption(activeImage) : '';
  const atStart = activeIndex === 0;
  const atEnd = activeIndex === images.length - 1;

  const handleInquire = useCallback(() => {
    if (!activeImage) return;
    openModal(
      <InquireForm initialImageId={activeImage.id} />,
      { title: 'Inquire about a painting' }
    );
  }, [activeImage, openModal]);

  return (
    <div className="portfolio-carousel" role="region" aria-label="Portfolio image carousel">
      <div
        className="portfolio-carousel__stage"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {images.map((image, index) => {
          const offset = index - activeIndex;
          if (Math.abs(offset) > visibleRadius) return null;

          const isActive = offset === 0;
          const ratio = ratios[image.id] ?? 1;
          const slideCaption = isActive ? activeCaption : '';

          return (
            <button
              key={image.id}
              type="button"
              className={`portfolio-carousel__slide${isActive ? ' portfolio-carousel__slide--active' : ''}`}
              style={getSlideStyle(offset, visibleRadius)}
              onClick={() => handleSlideClick(index, isActive)}
              aria-label={
                isActive
                  ? `Current image: ${image.caption || 'Instagram image'}`
                  : `Go to image ${index + 1}: ${image.caption || 'Instagram image'}`
              }
              aria-current={isActive ? 'true' : undefined}
              tabIndex={isActive ? -1 : 0}
            >
              <img
                src={image.media_url}
                alt={image.caption || ''}
                draggable={false}
                onLoad={(e) => handleImageLoad(image.id, e)}
                style={{ aspectRatio: ratio }}
              />
              {isActive && slideCaption && (
                <span className="portfolio-carousel__caption">{slideCaption}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="portfolio-carousel__controls">
        <button
          type="button"
          className="portfolio-carousel__nav-button"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous image"
        >
          ‹
        </button>
        <span className="portfolio-carousel__counter" aria-live="polite">
          {activeIndex + 1} / {images.length}
        </span>
        <button
          type="button"
          className="portfolio-carousel__nav-button"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next image"
        >
          ›
        </button>
        <button
          type="button"
          className="portfolio-carousel__inquire-button"
          onClick={handleInquire}
          aria-label="Inquire about this painting"
        >
          Inquire about this <PaletteOutlinedIcon fontSize="inherit" className="button-icon" />
        </button>
      </div>
    </div>
  );
}

export default PortfolioCarousel;
