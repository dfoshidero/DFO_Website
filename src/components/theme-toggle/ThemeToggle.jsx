import React, { useEffect, useState } from 'react';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

import { THEMES, getCurrentTheme, toggleTheme } from '../../utils/theme';
import './ThemeToggle.scss';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => getCurrentTheme());

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const handleClick = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const isLight = theme === THEMES.LIGHT;
  const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';

  return (
    <button
      type="button"
      className="theme-toggle-button"
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      {isLight ? (
        <DarkModeOutlinedIcon fontSize="inherit" className="button-icon" />
      ) : (
        <LightModeOutlinedIcon fontSize="inherit" className="button-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;
