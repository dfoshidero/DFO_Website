// SeeMore.jsx

import React from 'react';
import './Reload.scss';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { refreshRecommendation } from '../../content/recommendations/Recommendation';

const Reload = ({ url, text }) => {


  return (
    <button onClick={() => refreshRecommendation()} className="reload-button">
      ↻
    </button>
  );
};

export default Reload;
