import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ModalContext } from '../../utils/modalContext';

import './Portfolio.scss';

function PortfolioCard() {
  const { openModal } = useContext(ModalContext);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await axios.get(
            "https://z3mlw599i2.execute-api.eu-west-2.amazonaws.com/dev/fetchInstagramData"
          );
          const imagesData = JSON.parse(response.data.body); // Parse the JSON string into an array

          if (!Array.isArray(imagesData)) {
            console.log(imagesData);
            throw new Error(
              "API connected; token expired or response format invalid."
            );
          }

          setImages(imagesData);
          setLoading(false);
          return; // Exit the function if successful
        } catch (error) {
          console.error(`Attempt ${attempts} failed:`, error);
          if (attempts === maxAttempts) {
            setError(
              "Failed to fetch Instagram images: Connection or API error."
            );
            setLoading(false);
          }
        }
      }
    };

    fetchData();
  }, []);


  

  // Conditional rendering based on loading and error states
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
          <div
            key={image.id}
            className={`portfolio-item ${index % 3 === 0 ? 'left' : index % 3 === 2 ? 'right' : ''}`}
            onClick={() => openModal(
              <div className="portfolio-modal-content">
                <img src={image.media_url} alt={image.caption} style={{ opacity: 1 }}/>
                <p>{image.caption}</p>
                {image.media_type === 'CAROUSEL_ALBUM' && (
                  <p>{image.children[0].caption}</p> // Display the carousel caption if available
                )}
              </div>
            )}
          >
            <img
              src={image.media_url}
              alt={image.caption}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PortfolioCard;
