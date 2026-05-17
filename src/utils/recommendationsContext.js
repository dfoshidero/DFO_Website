import React, { createContext, useCallback, useMemo, useState } from 'react';

const recommendations = [
  {
    text: "Daniel joined KTC during his summer holidays working alongside me in our Data Analytics program. He was given the sub-project of normalising the data structure and associated data ETL, of an existing Commercial Dashboard. His objective was to normalise the data structure, update the ETL and produce documentation including a data dictionary. He showed himself to be self-motivated and applied his knowledge to great effect in delivering only the initial scope, but also additional requirements. He was thorough and interacted very well with the rest of team and left with a delivered solution ready for business users. I would have no hesitation in recommending Daniel from his time spent here at KTC",
    recommender: "Christopher Walter",
    role: "Interim Transformations Programs IT Director, KTC (Edibles) Ltd.",
  },
  {
    text: "Daniel was such an enthusiastic colleague and teammate at work. He was capable of managing his time successfully and produced quality results within short timeframes. He was passionate in all the tasks him and I engaged in and it helped him grow quite well within the team and the practice. He is as talented as he is enthusiastic.",
    recommender: "Joseph M. Mwaisaka",
    role: "Part II Architectural Assistant, Foster + Partners",
  },
  {
    text: "I had the pleasure of working with Daniel during the Datern Summer 2023 Internship programme. During this period, he was a great student and excelled in technical content covering Power BI, SQL and Python. Daniel has great communication skills, which he demonstrated during the course and his internship via his weekly check-ins. I'm confident that Daniel has a promising future in data, and I highly recommend him to any prospective employer.",
    recommender: "Tom Allport",
    role: "Founder, Datern",
  },
];

function getInitialIndex() {
  const stored = parseInt(
    localStorage.getItem('lastRecommendationIndex') || '-1',
    10
  );
  if (stored >= 0 && stored < recommendations.length) {
    return stored;
  }
  const newIndex = Math.floor(Math.random() * recommendations.length);
  localStorage.setItem('lastRecommendationIndex', newIndex);
  return newIndex;
}

export const RecommendationsContext = createContext();

export const RecommendationsProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(getInitialIndex);
  const [animationKey, setAnimationKey] = useState(0);

  const refreshRecommendation = useCallback(() => {
    const lastIndex = parseInt(
      localStorage.getItem('lastRecommendationIndex') || '-1',
      10
    );

    let newIndex = lastIndex;
    while (newIndex === lastIndex) {
      newIndex = Math.floor(Math.random() * recommendations.length);
    }

    localStorage.setItem('lastRecommendationIndex', newIndex);
    setCurrentIndex(newIndex);
    setAnimationKey((prev) => prev + 1);
  }, []);

  const value = useMemo(
    () => ({
      currentIndex,
      animationKey,
      refreshRecommendation,
      recommendation: recommendations[currentIndex],
    }),
    [currentIndex, animationKey, refreshRecommendation]
  );

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
};
