import React from 'react';
import './Contact.scss';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


export default function ContactCard() {
  const pdfUrl = "Oshidero_Daniel Favour_CV.pdf";

  return (
    <div className="contact-container">
      <a href="https://www.linkedin.com/in/favourdo/" className="connect-button linkedin" target="_blank" rel="noreferrer">
        LinkedIn <ArrowOutwardIcon fontSize="inherit" className="button-icon" />
        </a>
      <a href="https://github.com/dfoshidero" className="connect-button github" target="_blank" rel="noreferrer">
        GitHub<ArrowOutwardIcon fontSize="inherit" className="button-icon" />
        </a>

      <a
        href={pdfUrl}
        download="Oshidero_Daniel Favour_CV.pdf"
        className="connect-button download-cv">
        Download CV
        <ArrowDownwardIcon fontSize="inherit" className="button-icon" />
      </a>
    </div>
  );
}
