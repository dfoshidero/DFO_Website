import React, { useContext, useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import './Reload.scss';
import { RecommendationsContext } from '../../utils/recommendationsContext';

const SPIN_DURATION_MS = 350;

const Reload = () => {
  const { refreshRecommendation } = useContext(RecommendationsContext);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    if (isSpinning) return;
    refreshRecommendation();
    setIsSpinning(true);
    window.setTimeout(() => setIsSpinning(false), SPIN_DURATION_MS);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`reload-button${isSpinning ? ' is-spinning' : ''}`}
      aria-label="Refresh recommendation"
    >
      <RefreshIcon fontSize="inherit" />
    </button>
  );
};

export default Reload;
