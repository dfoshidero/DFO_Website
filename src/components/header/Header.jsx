import React from 'react';
import './Header.scss';
import profileIcon from '../../assets/images/icon.jpeg';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import ThemeToggle from '../theme-toggle/ThemeToggle';

const Header = ({ onRandomizeClick }) => {
  return (
    <div className="header">
      <div className="profile-name-title">
        <img src={profileIcon} alt="Profile Icon" />
        <div className="name-title">
          <div>
            <span className="name">Daniel Favour Olanrewaju Oshidero</span>
          </div>
          <div>
            <span className="title">Designer & Programmer // DFVRO</span>
          </div>
        </div>
      </div>
      
      <div className="right-container">
        <ThemeToggle />
        <button onClick={onRandomizeClick} className="shuffle-layout-button">
          <span className="button-text">Shuffle Cards</span>
          <AutorenewIcon fontSize="inherit" className="button-icon" />
        </button>

        <a href="mailto:dfoshidero@outlook.com" className="contact-button">
          <span className="button-text">Contact</span>
          <ArrowOutwardIcon fontSize="inherit" className="button-icon" />
        </a>
      </div>
    </div>
  );
};

export default Header;
