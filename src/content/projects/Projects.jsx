import React from 'react';
import './Projects.scss';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import { useContent, useUiText } from '../../utils/contentContext';
import { imageUrl } from '../../lib/sanity';

function ProjectCard({ project, labels, asListItem = false }) {
  const wrapperClass = asListItem ? 'project-item' : 'special-project-item';
  const image = imageUrl(project.image, 320);

  const content = (
    <>
      <a
        className="project-card-link"
        href={project.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title}`}
      >
        {image && (
          <div className="project-image-container">
            <img src={image} alt="" className="project-image" />
          </div>
        )}
        <div className="project-details">
          <div className="project-title">{project.title}</div>
          <div className="project-description">{project.description}</div>
          <div className="project-stack">{labels.stackPrefix}{project.stack}</div>
        </div>
      </a>
      {project.videoUrl && (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="view-button"
        >
          {labels.demoButtonLabel} <PlayCircleOutlineIcon className="button-icon" />
        </a>
      )}
    </>
  );

  if (asListItem) {
    return <li className={wrapperClass}>{content}</li>;
  }

  return <div className={wrapperClass}>{content}</div>;
}

export default function ProjectsCard() {
  const { projects } = useContent();
  const labels = useUiText().projects;

  const specialProject = projects.find((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <div className="projects-container">
      {specialProject && <ProjectCard project={specialProject} labels={labels} />}

      <div className="more-info-text">
        <span>{labels.hint}</span>
      </div>

      <ul className="projects-list">
        {otherProjects.map(project => (
          <ProjectCard key={project._id} project={project} labels={labels} asListItem />
        ))}
      </ul>
    </div>
  );
}
