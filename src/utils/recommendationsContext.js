import React, { createContext, useCallback, useMemo, useState } from 'react';

import { useContent } from './contentContext';

const STORAGE_KEY = 'lastRecommendationIndex';

function readStoredIndex(count) {
  const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '-1', 10);
  return stored >= 0 && stored < count ? stored : null;
}

function getInitialIndex(count) {
  if (count === 0) return 0;

  // Clamped against the current count: the list is editable now, so a stored
  // index can outlive the recommendation it pointed at.
  const stored = readStoredIndex(count);
  if (stored !== null) return stored;

  const newIndex = Math.floor(Math.random() * count);
  localStorage.setItem(STORAGE_KEY, newIndex);
  return newIndex;
}

export const RecommendationsContext = createContext();

export const RecommendationsProvider = ({ children }) => {
  const { recommendations } = useContent();
  const count = recommendations.length;

  const [currentIndex, setCurrentIndex] = useState(() => getInitialIndex(count));
  const [animationKey, setAnimationKey] = useState(0);

  const refreshRecommendation = useCallback(() => {
    // With one recommendation there is nothing to rotate to, and the loop below
    // would never terminate.
    if (count <= 1) {
      setCurrentIndex(0);
      setAnimationKey((prev) => prev + 1);
      return;
    }

    const lastIndex = readStoredIndex(count) ?? -1;

    let newIndex = lastIndex;
    while (newIndex === lastIndex) {
      newIndex = Math.floor(Math.random() * count);
    }

    localStorage.setItem(STORAGE_KEY, newIndex);
    setCurrentIndex(newIndex);
    setAnimationKey((prev) => prev + 1);
  }, [count]);

  const value = useMemo(
    () => ({
      currentIndex,
      animationKey,
      refreshRecommendation,
      recommendation: recommendations[Math.min(currentIndex, count - 1)],
    }),
    [currentIndex, animationKey, refreshRecommendation, recommendations, count]
  );

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
};
