import React from 'react';

import './Education.scss';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const educations = [
  {
    id: 1003,
    title: "Master of Science (M.Sc) // Applied Data Science",
    location: "Buckingham, UK",
    school: "University of Buckingham",
    graduation: "Expected Grad 2026",
    achieved: "",
    type: "degree",
  },
  {
    id: 1002,
    title: "Level 7 Certificate // Digital & Technology Solutions Specialist",
    location: "",
    school: "ESFA",
    graduation: "Expected Grad 2026",
    achieved: "",
    type: "degree",
  },
  {
    id: 1001,
    title: "Master of Science (M.Sc) // Computer Science",
    location: "Bath, UK",
    school: "University of Bath",
    graduation: "(Completed) Expected Grad 2024",
    achieved: "",
    type: "degree",
  },
  {
    id: 1000,
    title: "Bachelor of Science with Honours (B.Sc Hons) // Architecture",
    location: "Bath, UK",
    school: "University of Bath",
    graduation: "Graduated 2023",
    achieved: "2:1",
    type: "degree",
  },
  {
    id: 500,
    title: "Advanced-Level Qualifications // Art, Physics, Maths",
    location: "London, United Kingdom",
    school: "Harlington School",
    graduation: "Graduated 2019",
    achieved: "A*, A, A",
    type: "a-levels",
  },
  {
    id: 4,
    title: "Neo4j // Neo4j Certified Professional",
    graduation: "Issued Sept 2024",
    link: "https://graphacademy.neo4j.com/c/a313beac-9014-4ed2-ab76-ca43d0cb8bb6/",
  },
  {
    id: 3,
    title: "Udemy // C Programming for Beginners",
    graduation: "Issued Feb 2024",
    link: "https://www.udemy.com/certificate/UC-8d4d39f2-4002-415b-beb5-1eb00c24ec2e/",
  },
  {
    id: 2,
    title: "Udemy // Complete 2023 Web Development Bootcamp",
    graduation: "Issued Oct 2023",
    link: "https://www.udemy.com/certificate/UC-f3a9d97a-913d-453e-b471-ed31b2479a4e/",
  },
  {
    id: 1,
    title: "Amazon Web Services (AWS) // Certified Cloud Practitioner",
    graduation: "Issued Jul 2023",
    link: "https://www.credly.com/badges/4c769782-1735-4aae-b652-1413a1e65b75/linked_in_profile",
  },
];

export default function EducationCard() {
  return (
    <div className="education-container">
      <ul className="education-list">
        {educations.map((ed) => (
          <li
            key={ed.id}
            className={`education-item ${
              ed.type === "degree" ? "degree-item" : ""
            } ${ed.type === "a-levels" ? "a-levels-item" : ""}`}
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
                      View{" "}
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
        ==
      </ul>
    </div>
  );
}
