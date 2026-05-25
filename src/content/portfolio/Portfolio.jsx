import React, { useContext } from 'react';
import { ModalContext } from '../../utils/modalContext';

import PortfolioItem from './PortfolioItem';
import PortfolioCarousel from './PortfolioCarousel';
import { usePortfolioImages } from './usePortfolioImages';
import './Portfolio.scss';

function PortfolioCard() {
  const { openModal } = useContext(ModalContext);
  const { images, loading, error } = usePortfolioImages();

  if (loading) {
    return <div className="centered"><p key="loading">Loading data...</p></div>;
  }

  if (error) {
    const handleReportIssue = () => {
      window.location.href = "mailto:dfoshidero@outlook.com" +
        "?subject=Issue Report | Portfolio API " +
        "&body=Hello,%0D%0A%0D%0AI have encountered an issue with the Instagram Portfolio feature on the website. There seems to be a technical problem affecting its functionality.%0D%0A%0D%0APlease investigate and resolve this issue at your earliest convenience.%0D%0A%0D%0AThank you.%0D%0A";
    };

    return (
      <div className="centered">
        <p key="error" style={{ textAlign: "center" }}>
          {error}
          <br />
          Please select the link above to view.
        </p>
        <div className="report-padding">
          <button className="report-button" onClick={handleReportIssue}>
            Report Issue
          </button>
        </div>
      </div>
    );

  }

  return (
    <div className="portfolio-container">
      <div className="pull-text">
        <p>Pulled using Instagram API...</p>
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
