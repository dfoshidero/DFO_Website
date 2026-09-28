import React, { useContext } from 'react';
import { ModalContext } from '../../utils/modalContext';

import PortfolioItem from './PortfolioItem';
import PortfolioCarousel from './PortfolioCarousel';
import { usePortfolioImages } from './usePortfolioImages';
import './Portfolio.scss';
import { useSettings, useUiText } from '../../utils/contentContext';

function PortfolioCard() {
  const { openModal } = useContext(ModalContext);
  const { images, loading, error } = usePortfolioImages();
  const { contactEmail } = useSettings();
  const copy = useUiText().portfolio;

  if (loading) {
    return <div className="centered"><p key="loading">{copy.loadingText}</p></div>;
  }

  if (error) {
    const handleReportIssue = () => {
      // The body is stored as plain text with real line breaks; mailto needs it
      // percent-encoded, with CRLF pairs for the line separators.
      const body = copy.reportEmailBody.replace(/\r?\n/g, '\r\n');
      window.location.href =
        `mailto:${contactEmail}` +
        `?subject=${encodeURIComponent(copy.reportEmailSubject)}` +
        `&body=${encodeURIComponent(body)}`;
    };

    return (
      <div className="centered">
        <p key="error" style={{ textAlign: "center" }}>
          {error}
          <br />
          {copy.errorHelpText}
        </p>
        <div className="report-padding">
          <button className="report-button" onClick={handleReportIssue}>
            {copy.reportButtonLabel}
          </button>
        </div>
      </div>
    );

  }

  return (
    <div className="portfolio-container">
      <div className="pull-text">
        <p>{copy.pullText}</p>
      </div>

      <div className="portfolio-grid">
        {images.map((image, index) => (
          <PortfolioItem
            key={image.id}
            image={image}
            onOpen={() =>
              openModal(
                <PortfolioCarousel images={images} startIndex={index} />,
                { title: image.caption || 'Portfolio image' }
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export default PortfolioCard;
