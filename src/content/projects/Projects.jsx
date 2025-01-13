import React, { useState } from 'react';
import './Projects.scss';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import bloomImage from '../../assets/images/project-icons/bloom.png';
import ecoImage from "../../assets/images/project-icons/eco.svg";
import chip8Image from '../../assets/images/project-icons/chip-8.png';
import personalWebsite from '../../assets/images/project-icons/personal-website.png';

const projects = [
  {
    id: 1000,
    title: "DFVRO | Personal Resume Website",
    description:
      "If you're seeing this, you've successfully found my personal hub. Be sure to check it out on both mobile and web.",
    stack: "JavaScript with React, SCSS, Node.js, AWS for API interactions.",
    imageUrl: personalWebsite,
    projectUrl: "https://github.com/dfoshidero/dfo-website",
  },
  {
    id: 4,
    title: "ECO (Early-stage Carbon Observer)",
    description:
      "ECO is an ML-based tool which predicts embodied carbon from textual descriptions of architectural designs, integrating sustainability into early design processes.",
    stack:
      "Python (Scikit-learn, spaCy, NLTK), Flask, Docker, React.js",
    imageUrl: ecoImage,
    projectUrl: "https://github.com/dfoshidero/ECO",
    videoUrl: "https://www.youtube.com/watch?v=3kOdSKeSc2k",
  },
  {
    id: 3,
    title: "Bloom",
    description:
      "Bloom is an educational mobile app by Team Plum for University of Bath's CM50109 module. It teaches indoor plant care and offers interactive gameplay with rewards.",
    stack: "JavaScript with React-Native, Expo, Node.js",
    imageUrl: bloomImage,
    projectUrl: "https://github.com/dfoshidero/Bloom",
    videoUrl: "https://www.youtube.com/watch?v=v2pALOEpWOQ",
  },
  {
    id: 2,
    title: "CHIP-8 Emulator // Ongoing",
    description:
      "This emulator aims to replicate the behaviour of a CHIP-8 machine, allowing users to run and interact with CHIP-8 programs.",
    stack: "C, SDL2",
    imageUrl: chip8Image,
    projectUrl: "https://github.com/dfoshidero/CHIP-8-Emulator",
  },
  {
    id: 1,
    title: "Airline Database (CRUD) Simulator",
    stack: "Python with Tkinter, SQLite3",
    description:
      "Basic database simulator developed to explore data management in the context of a real-world system, using CRUD operations.",
    projectUrl: "https://github.com/dfoshidero/Database-CRUD-Sim",
  },
];

export default function ProjectsCard() {
  const [isHovered, setIsHovered] = useState(false);

  const handleProjectClick = (url, event) => {
    event.stopPropagation();
    window.open(url, '_blank');
  };

  // Extract the special project
  const specialProject = projects.find(project => project.id === 1000);
  // Filter out the special project from the main list
  const otherProjects = projects.filter(project => project.id !== 1000);

  return (
    <div className="projects-container">
      {/* Render the special project first, outside the projects list */}
      {specialProject && (
        <div className="special-project-item"
             onClick={(event) => handleProjectClick(specialProject.projectUrl, event)}>
          <div className="project-image-and-actions">
            {specialProject.imageUrl && (
              <div className="project-image-container">
                <img src={specialProject.imageUrl} alt={specialProject.title} className="project-image" />
              </div>
            )}
            {specialProject.videoUrl && (
              <a href={specialProject.videoUrl} target="_blank" rel="noopener noreferrer" className="view-button" 
                 onClick={(event) => { event.stopPropagation(); window.open(specialProject.videoUrl, '_blank'); }} 
                 onMouseEnter={() => setIsHovered(true)}
                 onMouseLeave={() => setIsHovered(false)}>
                Demo <PlayCircleOutlineIcon className="button-icon" />
              </a>
            )}
          </div>
          <div className="project-details">
            <div className="project-title">{specialProject.title}</div>
            <div className="project-description">{specialProject.description}</div>
            <div className="project-stack">Stack: {specialProject.stack}</div>
          </div>
        </div>
      )}

      <div className="more-info-text">
        <span>Click items to see more...</span> 
      </div>

      <ul className="projects-list">
        {/* Render the other projects */}
        {otherProjects.map(project => (
          <li key={project.id} 
              className={`project-item ${isHovered ? 'no-hover' : ''} ${!project.videoUrl ? 'no-action-button' : ''}`} 
              onClick={(event) => handleProjectClick(project.projectUrl, event)}>
            <div className="project-image-and-actions">
              {project.imageUrl && (
                <div className="project-image-container">
                  <img src={project.imageUrl} alt={project.title} className="project-image" />
                </div>
              )}
              {project.videoUrl && (
                <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="view-button" 
                   onClick={(event) => { event.stopPropagation(); window.open(project.videoUrl, '_blank'); }} 
                   onMouseEnter={() => setIsHovered(true)}
                   onMouseLeave={() => setIsHovered(false)}>
                  Demo <PlayCircleOutlineIcon className="button-icon" />
                </a>
              )}
            </div>
            <div className="project-details">
              <div className="project-title">{project.title}</div>
              <div className="project-description">{project.description}</div>
              <div className="project-stack">Stack: {project.stack}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
