import React, { useContext } from 'react';
import { PortableText } from '@portabletext/react';

import { ModalContext } from '../../utils/modalContext';
import { useContent, useUiText } from '../../utils/contentContext';
import { imageUrl } from '../../lib/sanity';

import './Experience.scss';

// Falls back if the Studio field is blank: join(undefined) would silently use a
// comma, which reads as a different list rather than as missing text.
const SKILLS_SEPARATOR = ' · ';

/**
 * Maps Portable Text to the same plain elements the long descriptions used to
 * produce as raw HTML, so the existing .experience-body styles keep applying.
 */
const portableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ value, children }) => <a href={value?.href}>{children}</a>,
  },
};

function ExperienceHeading({ role, company, location, className = '' }) {
  return (
    <div className={`experience-heading ${className}`.trim()}>
      <p className="experience-heading__role">{role}</p>
      {company && <p className="experience-heading__company">{company}</p>}
      {location && <p className="experience-heading__location">{location}</p>}
    </div>
  );
}

export default function ExperienceCard() {
  const { openModal } = useContext(ModalContext);
  const { experiences } = useContent();
  const { experience: labels } = useUiText();

  const handleExperienceClick = (experience) => {
    const modalTitle = experience.company
      ? `${experience.role} at ${experience.company}`
      : experience.role;
    openModal(<ExperienceModalContent experience={experience} />, { title: modalTitle });
  };

  const ExperienceModalContent = ({ experience }) => {
    const skills = experience.skills?.length
      ? experience.skills.join(labels.skillsSeparator || SKILLS_SEPARATOR)
      : '';

    return (
    <div className="experience-modal-content">
      <div className="experience-list-modal">
        {experiences.map((exp) => (
          <button
            key={exp._id}
            type="button"
            className={`experience-item-modal ${exp._id === experience._id ? 'active' : ''}`}
            onClick={() => handleExperienceClick(exp)}
            aria-current={exp._id === experience._id ? 'true' : undefined}
          >
            <span className="experience-item-modal__role">{exp.role}</span>
            {exp.company && (
              <span className="experience-item-modal__company">{exp.company}</span>
            )}
          </button>
        ))}
      </div>
      <div className="experience-detail-modal">
        <header className="modal-header">
          <img
            src={imageUrl(experience.logo, 160)}
            alt=""
            className="company-logo"
            aria-hidden="true"
          />
          <ExperienceHeading
            role={experience.role}
            company={experience.company}
            location={experience.location}
          />
        </header>
        {skills && (
          <section className="experience-skills" aria-label={labels.skillsSectionLabel}>
            <span className="experience-section-label">{labels.skillsSectionLabel}</span>
            <p className="experience-skills__list">{skills}</p>
          </section>
        )}

        <section className="experience-body">
          <PortableText
            value={experience.longDescription}
            components={portableTextComponents}
          />
        </section>

      </div>
    </div>
    );
  };

  return (
    <div className="experience-container">
      <ul className="experience-list">
        {experiences.map((exp) => {
          const ariaLabel = exp.company ? `${exp.role} at ${exp.company}` : exp.role;

          return (
          <li key={exp._id} className="experience-item">
            <button
              type="button"
              className="experience-item-button"
              onClick={() => handleExperienceClick(exp)}
              aria-label={`View details for ${ariaLabel}`}
            >
            <div className="experience-title">
              <span className="experience-title__role">{exp.role}</span>
              {exp.company && <span className="experience-title__company">{exp.company}</span>}
            </div>
            <div className="experience-shortdesc">{exp.shortDescription}</div>
            <div className="experience-location">{exp.location}</div>
            </button>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
