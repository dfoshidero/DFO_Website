import React, { createContext, useContext, useMemo, useState } from "react";
import VerifiedIcon from '@mui/icons-material/Verified';

import "./Skills.scss";

const skills = [
  {
    id: 1,
    skill: "Cloud Services",
    certified: true,
    link: "https://www.credly.com/badges/4c769782-1735-4aae-b652-1413a1e65b75/linked_in_profile",
  },
  {
    id: 2,
    skill: "Web Development",
    completed: true,
    link: "https://www.udemy.com/certificate/UC-f3a9d97a-913d-453e-b471-ed31b2479a4e/",
  },

  {
    id: 3,
    skill: "C (Programming Language)",
    completed: true,
    link: "https://www.udemy.com/certificate/UC-8d4d39f2-4002-415b-beb5-1eb00c24ec2e/",
  },
  {
    id: 4,
    skill: "JavaScript",
  },
  {
    id: 5,
    skill: "HTML/CSS",
  },
  {
    id: 6,
    skill: "React || React-Native",
  },
  {
    id: 7,
    skill: "Python",
  },
  {
    id: 8,
    skill: "SQL",
  },
  {
    id: 9,
    skill: "MongoDB",
  },
  {
    id: 10,
    skill: "Neo4J",
    certified: true,
    link: "https://graphacademy.neo4j.com/c/a313beac-9014-4ed2-ab76-ca43d0cb8bb6/",
  },
  {
    id: 11,
    skill: "Microsoft Power BI",
  },
  {
    id: 12,
    skill: "Autodesk Revit  ",
    certified: true,
    link: "https://www.linkedin.com/in/favourdo/details/certifications/1707000019275/single-media-viewer/?profileId=ACoAACmhpvMB9MywAsViJ_T-Bq76dnz12-1Zx6c",
  },
  {
    id: 13,
    skill: "Autodesk AutoCAD",
  },
  {
    id: 14,
    skill: "Adobe Photoshop",
  },
  {
    id: 15,
    skill: "Adobe Indesign",
  },
];

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

  const buttons = [
    {
      key: "certified",
      modifier: "certified",
      label: "Filter by certified",
    },
    {
      key: "completed",
      modifier: "completed",
      label: "Filter by completed course",
    },
  ];

  return (
    <div className="skills-filter-controls" role="group" aria-label="Filter skills">
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
  const { filters } = useSkillsFilter();
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
          <li key={item.skill} className="skills-item">
            <span className="skills-title">{item.skill}</span>
            {item.certified && item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="certified-section"
              >
                <span className="certified-label">CERTIFIED</span>
                <VerifiedIcon className="certified-icon" />
              </a>
            )}
            {item.certified && !item.link && (
              <div className="certified-section non-clickable">
                <span className="certified-label">CERTIFIED</span>
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
                <span className="completed-label">COURSE</span>
                <VerifiedIcon className="completed-icon" />
              </a>
            )}
            {item.completed && !item.link && (
              <div className="completed-section non-clickable">
                <span className="completed-label">COURSE</span>
                <VerifiedIcon className="completed-icon" />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
