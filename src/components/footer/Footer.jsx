import React from 'react';
import './Footer.scss';

const Footer = ({ onRandomizeClick }) => {
    return (
      <div className="footer">
        <div className="name-title">
          <div>
            <span className="design-info">
              As of: October 18, 2024
            </span>
          </div>
        </div>

        <div className="left-container">
          <div>
            <span className="design-info">
              Original Design Concept by
              <span> </span>
              <a
                className="link"
                href="https://lucasporterbakker.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lukas Porter Bakker
              </a>
              . | Adapted & Re-Developed for DFO by DFO.
            </span>
          </div>
        </div>
      </div>
    );
};

export default Footer;
