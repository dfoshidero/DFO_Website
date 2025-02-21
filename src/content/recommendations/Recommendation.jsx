// Recommendation.jsx

import React from 'react';
import './Recommendation.scss'; // Assuming you have a separate SCSS file for recommendations

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

let refreshRecommendationGlobal = () => {};
let triggerAnimationGlobal = () => {};

export default function RecommendationCard() {
  const [randomIndex, setRandomIndex] = React.useState(-1);
  const [animationKey, setAnimationKey] = React.useState(0);

  const refreshRecommendation = () => {
    // Get the previously used index from localStorage (or -1 if none stored)
    const lastIndex = parseInt(
      localStorage.getItem("lastRecommendationIndex") || "-1",
      10
    );

    let newIndex = lastIndex;
    // Keep picking a new random index until it's different from the last index
    while (newIndex === lastIndex) {
      newIndex = Math.floor(Math.random() * recommendations.length);
    }

    // Update state
    setRandomIndex(newIndex);
    // Save it so next time we don't pick the same one
    localStorage.setItem("lastRecommendationIndex", newIndex);
    setAnimationKey((prev) => prev + 1);
  };

  React.useEffect(() => {
    refreshRecommendationGlobal = refreshRecommendation;
    triggerAnimationGlobal = () => setAnimationKey(prev => prev + 1);
    refreshRecommendation();
  }, []);

  const recommendation = recommendations[randomIndex] || recommendations[0];

  return (
    <div className="recommendation-container" key={animationKey}>
      <div className="recommendation-text">{recommendation.text}"</div>
      <div className="recommendation-recommender">{recommendation.recommender}</div>
      <div className="recommendation-recommender">{recommendation.role}</div>
    </div>
  );
}

export const refreshRecommendation = () => refreshRecommendationGlobal();
export const triggerAnimation = () => triggerAnimationGlobal();
