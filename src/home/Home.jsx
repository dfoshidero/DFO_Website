import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import Header from "../components/header/Header";
import { generateLayout, LayoutCard } from './LayoutConfigRandom';
import './Home.scss';
import { useMediaQuery } from 'react-responsive';
import ScrollIndicator from '../components/scrollIndicator/scrollIndicator';
import Footer from '../components/footer/Footer';

const MIN_CARD_WIDTH = 200;
const MIN_SCALE = 0.85;

let sessionInitialLayout = null;

function Home() {
  const containerRef = useRef(null);
  const pageFramerRef = useRef(null);
  const pageCenteringRef = useRef(null);
  const naturalSizeRef = useRef(null);

  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const isIntermediateLayout = useMediaQuery({ maxWidth: 6 * MIN_CARD_WIDTH });
  const isFinalLayout = useMediaQuery({ maxWidth: 4 * MIN_CARD_WIDTH });

  let gridColumns = 6, gridRows = 4;
  if (isFinalLayout) {
      gridColumns = 2;
      gridRows = 12;
  } else if (isIntermediateLayout) {
      gridColumns = 4;
      gridRows = 6;
  }

  const [layout, setLayout] = useState(() => {
    if (!sessionInitialLayout) {
      sessionInitialLayout = generateLayout(gridColumns, gridRows);
    }
    return sessionInitialLayout;
  });

  const [animateEntrance, setAnimateEntrance] = useState(true);
  const [shuffleEpoch, setShuffleEpoch] = useState(0);

  const prevGridRef = useRef({ gridColumns, gridRows });

  useEffect(() => {
    const prev = prevGridRef.current;
    if (prev.gridColumns === gridColumns && prev.gridRows === gridRows) return;

    prevGridRef.current = { gridColumns, gridRows };
    setAnimateEntrance(false);
    setLayout(generateLayout(gridColumns, gridRows));
  }, [gridColumns, gridRows]);

  const handleRandomize = useCallback(() => {
    setAnimateEntrance(true);
    setShuffleEpoch((epoch) => epoch + 1);
    setLayout(generateLayout(gridColumns, gridRows));
  }, [gridColumns, gridRows]);

  const updatePageScale = useCallback((remeasure = false) => {
    const framer = pageFramerRef.current;
    const centering = pageCenteringRef.current;
    if (!framer || !centering) return;

    // Only apply scaling on the desktop (6x4) layout. Intermediate (4x6) and
    // mobile (2x12) layouts have their own reflow, so let them lay out at 1x.
    if (isFinalLayout || isIntermediateLayout) {
      naturalSizeRef.current = null;
      framer.style.setProperty('--page-scale', '1');
      return;
    }

    if (remeasure || !naturalSizeRef.current) {
      const currentScaleRaw = getComputedStyle(framer)
        .getPropertyValue('--page-scale')
        .trim();
      const currentScale = parseFloat(currentScaleRaw) || 1;

      const rect = centering.getBoundingClientRect();
      const naturalWidth = rect.width / currentScale;
      const naturalHeight = rect.height / currentScale;

      if (naturalWidth <= 0 || naturalHeight <= 0) return;

      naturalSizeRef.current = { width: naturalWidth, height: naturalHeight };
    }

    const { width: naturalWidth, height: naturalHeight } = naturalSizeRef.current;

    const fitW = window.innerWidth / naturalWidth;
    const fitH = window.innerHeight / naturalHeight;
    const scale = Math.max(MIN_SCALE, Math.min(1, fitW, fitH));

    framer.style.setProperty('--page-scale', String(scale));
  }, [isFinalLayout, isIntermediateLayout]);

  useLayoutEffect(() => {
    naturalSizeRef.current = null;
    updatePageScale(true);

    const handleResize = () => {
      naturalSizeRef.current = null;
      updatePageScale(true);
    };
    window.addEventListener('resize', handleResize);

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        naturalSizeRef.current = null;
        updatePageScale(true);
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
    };
  }, [updatePageScale, gridColumns, gridRows]);

  return (
    <div>
      <div className="page-framer" ref={pageFramerRef}>
        <div className="page-centering" ref={pageCenteringRef}>
          {showScrollIndicator && <ScrollIndicator />}
          <Header onRandomizeClick={handleRandomize} />
          <div className="main-content-framer" ref={containerRef}>
            {layout.map((config, index) => (
              <LayoutCard
                key={
                  animateEntrance && shuffleEpoch > 0
                    ? `${config.cardType}-${shuffleEpoch}`
                    : config.cardType
                }
                config={config}
                animationDelay={index * 0.1}
                animateEntrance={animateEntrance}
              />
            ))}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
