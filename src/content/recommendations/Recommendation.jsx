import React, { useContext } from 'react';
import './Recommendation.scss';
import { RecommendationsContext } from '../../utils/recommendationsContext';

export default function RecommendationCard() {
  const { recommendation, animationKey } = useContext(RecommendationsContext);

  return (
    <div className="recommendation-container" key={animationKey}>
      <div className="recommendation-text">{recommendation.text}"</div>
      <div className="recommendation-recommender">{recommendation.recommender}</div>
      <div className="recommendation-recommender">{recommendation.role}</div>
    </div>
  );
}
