import React from 'react';

import './Education.scss';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

import { useContent, useUiText } from '../../utils/contentContext';

export default function EducationCard() {
  const { educations } = useContent();
  const { viewButtonLabel } = useUiText().education;

  return (
    <div className="education-container">
      <ul className="education-list">
        {educations.map((ed) => (
          <li
            key={ed._id}
            className={`education-item ${
              ed.kind === "degree" ? "degree-item" : ""
            } ${ed.kind === "a-levels" ? "a-levels-item" : ""}`}
          >
            <div className="education-title">{ed.title}</div>
            <div className="graduation-and-button">
              <div className="education-grad">
                {ed.school && !ed.location && (
                  <span className="education-location">{ed.school} | </span>
                )}
                {ed.graduation}
                {ed.achieved && <span>, {ed.achieved}</span>}.
              </div>
              {ed.link && (
                <button className="certification-button">
                  <a href={ed.link} target="_blank" rel="noopener noreferrer">
                    <span className="button-content">
                      {viewButtonLabel}{" "}
                      <ArrowOutwardIcon
                        fontSize="inherit"
                        className="button-icon"
                      />
                    </span>
                  </a>
                </button>
              )}
            </div>
            {ed.school && ed.location && (
              <div className="education-location">
                {ed.school} | {ed.location}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
