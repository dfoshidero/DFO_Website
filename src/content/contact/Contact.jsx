import React from 'react';
import './Contact.scss';

import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useSettings, useUiText } from '../../utils/contentContext';
import { downloadUrl } from '../../lib/sanity';


export default function ContactCard() {
  const settings = useSettings();
  const { contact } = useUiText();
  const pdfUrl = downloadUrl(settings.cvFile, settings.cvDownloadName);

  return (
    <div className="contact-container">
      <a href={settings.linkedinUrl} className="connect-button linkedin" target="_blank" rel="noreferrer">
        {contact.linkedinLabel} <ArrowOutwardIcon fontSize="inherit" className="button-icon" />
        </a>
      <a href={settings.githubUrl} className="connect-button github" target="_blank" rel="noreferrer">
        {contact.githubLabel}<ArrowOutwardIcon fontSize="inherit" className="button-icon" />
        </a>

      <a
        href={pdfUrl}
        download={settings.cvDownloadName}
        className="connect-button download-cv">
        {contact.cvButtonLabel}
        <ArrowDownwardIcon fontSize="inherit" className="button-icon" />
      </a>
    </div>
  );
}
