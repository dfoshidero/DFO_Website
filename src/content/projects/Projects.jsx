import React from 'react';
import './Projects.scss';

import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import bloomImage from '../../assets/images/project-icons/bloom.png';
import ecoImage from "../../assets/images/project-icons/eco.png";
import chip8Image from '../../assets/images/project-icons/chip-8.svg';
import personalWebsite from '../../assets/images/project-icons/personal-website.png';
import deepRlImage from '../../assets/images/project-icons/deep-rl.svg';

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
    id: 5,
    title: "Deep RL for Game Environments: Doom & CartPole",
    description:
      'Deep reinforcement learning agents trained with DDDQN, DRQN, PPO, and REINFORCE on CartPole and VizDoom\'s "Defend the Center", using MDP/CNN frameworks to navigate high-dimensional state/action spaces.',
    stack: "Python, PyTorch",
    imageUrl: deepRlImage,
    projectUrl: "https://github.com/dfoshidero/RLModels_DOOM-CP",
    videoUrl: "https://www.youtube.com/watch?v=LtSFtUWTaws",
  },
  {
    id: 4,
    title: "ECO (Early-stage Carbon Observer)",
    description:
      "ECO is an ML-based tool which predicts embodied carbon from textual descriptions of architectural designs, integrating sustainability into early design processes.",
    stack: "Python (Scikit-learn, spaCy, NLTK), Flask, Docker, React.js",
    imageUrl: ecoImage,
    projectUrl: "https://www.talkingcarbon.com",
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

function ProjectCard({ project, asListItem = false }) {
  const wrapperClass = asListItem ? 'project-item' : 'special-project-item';

  const content = (
    <>
      <a
        className="project-card-link"
        href={project.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title} on GitHub`}
      >
        {project.imageUrl && (
          <div className="project-image-container">
            <img src={project.imageUrl} alt="" className="project-image" />
          </div>
        )}
        <div className="project-details">
          <div className="project-title">{project.title}</div>
          <div className="project-description">{project.description}</div>
          <div className="project-stack">Stack: {project.stack}</div>
        </div>
      </a>
      {project.videoUrl && (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="view-button"
        >
          Demo <PlayCircleOutlineIcon className="button-icon" />
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
  const specialProject = projects.find(project => project.id === 1000);
  const otherProjects = projects.filter(project => project.id !== 1000);

  return (
    <div className="projects-container">
      {specialProject && <ProjectCard project={specialProject} />}

      <div className="more-info-text">
        <span>Click items to see more...</span>
      </div>

      <ul className="projects-list">
        {otherProjects.map(project => (
          <ProjectCard key={project.id} project={project} asListItem />
        ))}
      </ul>
    </div>
  );
}
