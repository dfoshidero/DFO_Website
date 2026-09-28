import React, { createContext, useContext, useMemo, useState } from "react";
import VerifiedIcon from '@mui/icons-material/Verified';

import "./Skills.scss";

import { useContent, useUiText } from "../../utils/contentContext";


const DEFAULT_FILTERS = { certified: false, completed: false };
const SkillsFilterContext = createContext({
  filters: DEFAULT_FILTERS,
  toggle: () => {},
});

export function SkillsFilterProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const value = useMemo(
    () => ({
      filters,
      toggle: (key) =>
        setFilters((prev) => ({ ...prev, [key]: !prev[key] })),
    }),
    [filters]
  );
  return (
    <SkillsFilterContext.Provider value={value}>
      {children}
    </SkillsFilterContext.Provider>
  );
}

function useSkillsFilter() {
  return useContext(SkillsFilterContext);
}

export function SkillsFilterControls() {
  const { filters, toggle } = useSkillsFilter();
  const labels = useUiText().skills;

  const buttons = [
    {
      key: "certified",
      modifier: "certified",
      label: labels.filterCertifiedLabel,
    },
    {
      key: "completed",
      modifier: "completed",
      label: labels.filterCompletedLabel,
    },
  ];

  return (
    <div className="skills-filter-controls" role="group" aria-label={labels.filterGroupLabel}>
      {buttons.map(({ key, modifier, label }) => {
        const isActive = filters[key];
        return (
          <button
            key={key}
            type="button"
            className={`skills-filter-button skills-filter-button--${modifier}${isActive ? " is-active" : ""}`}
            onClick={() => toggle(key)}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
          >
            <VerifiedIcon fontSize="inherit" />
          </button>
        );
      })}
    </div>
  );
}

export default function SkillsCard() {
  const { skills } = useContent();
  const { filters } = useSkillsFilter();
  const labels = useUiText().skills;
  const anyFilterActive = filters.certified || filters.completed;

  const visibleSkills = anyFilterActive
    ? skills.filter(
        (item) =>
          (filters.certified && item.certified) ||
          (filters.completed && item.completed)
      )
    : skills;

  return (
    <div className="skills-container">
      <ul className="skills-list">
        {visibleSkills.map((item) => (
          <li key={item._id} className="skills-item">
            <span className="skills-title">{item.name}</span>
            {item.certified && item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="certified-section"
              >
                <span className="certified-label">{labels.certifiedLabel}</span>
                <VerifiedIcon className="certified-icon" />
              </a>
            )}
            {item.certified && !item.link && (
              <div className="certified-section non-clickable">
                <span className="certified-label">{labels.certifiedLabel}</span>
                <VerifiedIcon className="certified-icon" />
              </div>
            )}
            {item.completed && item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="completed-section"
              >
                <span className="completed-label">{labels.completedLabel}</span>
                <VerifiedIcon className="completed-icon" />
              </a>
            )}
            {item.completed && !item.link && (
              <div className="completed-section non-clickable">
                <span className="completed-label">{labels.completedLabel}</span>
                <VerifiedIcon className="completed-icon" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
