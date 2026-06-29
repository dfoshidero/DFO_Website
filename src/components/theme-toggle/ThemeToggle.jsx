import React, { useEffect, useState } from 'react';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

import {
  THEMES,
  getCurrentTheme,
  toggleTheme,
} from '../../utils/theme';
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

  const isDark = theme === THEMES.DARK;
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      className={`theme-toggle${isDark ? ' theme-toggle--dark' : ''}`}
      onClick={handleClick}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb" />
        <LightModeOutlinedIcon
          fontSize="inherit"
          className="theme-toggle__icon theme-toggle__icon--sun"
        />
        <DarkModeOutlinedIcon
          fontSize="inherit"
          className="theme-toggle__icon theme-toggle__icon--moon"
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
