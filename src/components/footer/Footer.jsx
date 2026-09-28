import React from 'react';
import './Footer.scss';
import buildInfo from '../../buildInfo.json';
import { useSettings, useUiText } from '../../utils/contentContext';

const formattedLastUpdated = new Date(buildInfo.lastUpdated).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const Footer = ({ onRandomizeClick }) => {
    const currentYear = new Date().getFullYear();
    const { copyrightName } = useSettings();
    const { footer } = useUiText();

    return (
      <div className="footer">
        <div className="name-title">
          <span className="design-info">
            &copy; {currentYear} {copyrightName}. {footer.rightsText}
          </span>
        </div>

        <div className="left-container">
          <span className="design-info">
            {footer.builtWithText} <span className="dot">&middot;</span> {footer.lastUpdatedPrefix} {formattedLastUpdated}.
          </span>
        </div>
      </div>
    );
};

export default Footer;
