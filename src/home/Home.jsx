import React, { useEffect, useRef, useState, useCallback } from 'react';
import Header from "../components/header/Header";
import { generateLayout, LayoutCard } from './LayoutConfigRandom';
import './Home.scss';
import { useMediaQuery } from 'react-responsive';
import ScrollIndicator from '../components/scrollIndicator/scrollIndicator';
import Footer from '../components/footer/Footer';

const MIN_CARD_WIDTH = 200;

let sessionInitialLayout = null;

function Home() {
  const containerRef = useRef(null);

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

  return (
    <div>
      <div className="page-framer">
        <div className="page-centering">
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
