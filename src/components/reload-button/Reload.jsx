import React, { useContext } from 'react';
import './Reload.scss';
import { RecommendationsContext } from '../../utils/recommendationsContext';

const Reload = () => {
  const { refreshRecommendation } = useContext(RecommendationsContext);

  return (
    <button onClick={() => refreshRecommendation()} className="reload-button">
      ↻
    </button>
  );
};

export default Reload;
