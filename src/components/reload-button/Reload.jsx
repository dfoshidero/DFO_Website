// SeeMore.jsx

import React from 'react';
import './Reload.scss';
import { refreshRecommendation } from '../../content/recommendations/Recommendation';

const Reload = ({ url, text }) => {


  return (
    <button onClick={() => refreshRecommendation()} className="reload-button">
      ↻
    </button>
  );
};

export default Reload;
