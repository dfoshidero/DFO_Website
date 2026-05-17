import React, { useEffect, useRef, useState } from 'react';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

import {
  THEMES,
  getCurrentTheme,
  runThemeIntro,
  shouldRunThemeIntro,
  toggleTheme,
} from '../../utils/theme';
import './ThemeToggle.scss';

const ThemeToggle = () => {
  const buttonRef = useRef(null);
  const [theme, setTheme] = useState(() => getCurrentTheme());

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  useEffect(() => {
    if (!shouldRunThemeIntro()) return undefined;

    const startTimer = window.setTimeout(() => {
      buttonRef.current?.classList.add('theme-toggle-button--intro');
      runThemeIntro().finally(() => {
        buttonRef.current?.classList.remove('theme-toggle-button--intro');
        setTheme(getCurrentTheme());
      });
    }, 900);

    return () => window.clearTimeout(startTimer);
  }, []);

  const handleClick = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  const isLight = theme === THEMES.LIGHT;
  const label = isLight ? 'Switch to dark theme' : 'Switch to light theme';

  return (
    <button
      ref={buttonRef}
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
