import React from 'react';
import './Header.scss';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import ThemeToggle from '../theme-toggle/ThemeToggle';
import { useSettings, useUiText } from '../../utils/contentContext';
import { imageUrl } from '../../lib/sanity';

const Header = ({ onRandomizeClick }) => {
  const settings = useSettings();
  const { header } = useUiText();

  return (
    <div className="header">
      {/* The visible name is a styled span whose `width: 10%` only applies to an
          inline box, so it cannot become the h1 without shifting the layout.
          This gives the page the top-level heading it otherwise lacks. */}
      <h1 className="visually-hidden">
        {settings.fullName} — {settings.tagline}
      </h1>
      <div className="profile-name-title">
        <img src={imageUrl(settings.profileIcon, 160)} alt={header.profileIconAlt} />
        <div className="name-title">
          <div>
            <span className="name">{settings.fullName}</span>
          </div>
          <div>
            <span className="title">{settings.tagline}</span>
          </div>
        </div>
      </div>
      
      <div className="right-container">
        <ThemeToggle />
        <button onClick={onRandomizeClick} className="shuffle-layout-button">
          <span className="button-text">{header.shuffleButtonLabel}</span>
          <AutorenewIcon fontSize="inherit" className="button-icon" />
        </button>

        <a href={`mailto:${settings.contactEmail}`} className="contact-button">
          <span className="button-text">{header.contactButtonLabel}</span>
          <ArrowOutwardIcon fontSize="inherit" className="button-icon" />
        </a>
      </div>
    </div>
  );
};

export default Header;
