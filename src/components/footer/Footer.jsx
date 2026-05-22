import React from 'react';
import './Footer.scss';
import buildInfo from '../../buildInfo.json';

const formattedLastUpdated = new Date(buildInfo.lastUpdated).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const Footer = ({ onRandomizeClick }) => {
    const currentYear = new Date().getFullYear();

    return (
      <div className="footer">
        <div className="name-title">
          <span className="design-info">
            &copy; {currentYear} Daniel Favour Oshidero. All rights reserved.
          </span>
        </div>

        <div className="left-container">
          <span className="design-info">
            Designed &amp; built with care. <span className="dot">&middot;</span> Last updated {formattedLastUpdated}.
          </span>
        </div>
      </div>
    );
};

export default Footer;
