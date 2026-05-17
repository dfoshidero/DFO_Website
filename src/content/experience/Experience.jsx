import React, { useContext } from 'react';

import { ModalContext } from '../../utils/modalContext';

import './Experience.scss';

import logoIntropic from '../../assets/images/logos/intropic.webp';
import logoETAS from "../../assets/images/logos/etas.png"; 
import logoKTC from '../../assets/images/logos/ktc.png'; 
import logoDATERN from '../../assets/images/logos/datern.png'; 
import logoSkillsCoCreator from '../../assets/images/logos/university_of_bath.png'; 
import logoACSChair from '../../assets/images/logos/university_of_bath_acs.png'; 
import logoFP from '../../assets/images/logos/f_p.png'; 
import logoRS from '../../assets/images/logos/rs_architects_logo.png'; 
import logoAHMM from '../../assets/images/logos/ahmm.png'; 

const experiences = [
  {
    id: 0,
    title: "Software Engineer (Full-Stack, AI/ML) // Intropic",
    location: "London, England, United Kingdom",
    shortdesc:
      "Contributing to the platform team at an AI-driven finance and investment analytics SaaS provider serving institutional capital markets clients.",
    longdesc: `<p>Intropic is an independent equity research and information company combining agentic AI systems with elastic cloud infrastructure to deliver financial analytics products to hedge funds, asset managers, investment banks, and other institutional clients.</p>

    <p>As a Software Engineer on the platform team, I contribute to building and maintaining the core systems that power Intropic's product suite. My responsibilities include:</p>

    <ul>
        <li>Contributing as a member of the platform team across full-stack and AI/ML initiatives.</li>
    </ul>`,
    skills:
      "Software Development · Full-Stack Development · Python · JavaScript · React · AI/ML · AWS",
    logo: logoIntropic,
  },
  {
    id: 1,
    title: "Software Engineer (Data Systems & Infrastructure) // Robert Bosch GmbH & ETAS Ltd.",
    location: "Manchester, England, United Kingdom | Remote",
    shortdesc:
      "Data systems and infrastructure for automotive embedded diagnostics — cost-optimised analytics platforms, ML-driven fault prediction, production NLP interfaces, and compliance-ready AWS security.",
    longdesc: `<p>ETAS, a subsidiary of Robert Bosch GmbH, develops embedded software for the automotive industry, focused on diagnostics, performance, and efficiency.</p>

    <p>As a Software Engineer on data systems and infrastructure, I delivered production-scale pipelines, observability, and ML tooling for diagnostic analytics. Key responsibilities and achievements include:</p>

    <ul>
        <li>Cut analytics platform costs by ~88% (from $5.5k to $675/month) by replacing managed AWS OpenSearch/OSIS with a self-managed EC2 OpenSearch cluster using Python-based ingesters and parsers, maintaining horizontal scalability with Kubernetes orchestration.</li>
        <li>Designed pattern mining algorithms for sequence-based machine learning models to analyse temporal diagnostic logs and predict next-likely vehicle faults, with approximately 60% accuracy.</li>
        <li>Architected a production-ready, RESTful NLP interface for Neo4j using transformer intent models and LoRA fine-tuning, enabling non-technical users to query the graph database with above 90% success.</li>
        <li>Designed and automated system observability for infrastructure operations with Java, Terraform, and Jenkins, managing Linux-based servers (Amazon Linux, Ubuntu) across production and staging environments at scale by monitoring DNS resolution, host connectivity, and service health metrics to generate diagnostic reports for 25+ stakeholders.</li>
        <li>Implemented AWS security controls and audit-ready logging for compliance under ISO and NIST frameworks, and GDPR requirements (least-privilege IAM, KMS encryption at rest, TLS in transit, and centralised logging via CloudTrail/CloudWatch).</li>
        <li>Re-architected legacy ingestion into a scalable Python XML-to-JSON AWS Lambda pipeline processing 130M+ records/day, handling high-volume document intake via SFTP/SSH, enabling over 70% latency reduction in the pipeline end-to-end.</li>
    </ul>`,
    skills:
      "Software Design · Software Development · Python · Java · Neo4j · AWS · Terraform · Jenkins · Kubernetes · Angular",
    logo: logoETAS,
  },
  {
    id: 2,
    title: "Data Engineer & Analyst (BI Infrastructure) // KTC Edibles Ltd.",
    location: "Wolverhampton, England, United Kingdom",
    shortdesc:
      "Engineered automated SQL ETL pipelines and enhanced BI dashboards — eliminating 16+ hours of weekly manual work and achieving a 93% improvement in reporting efficiency for 80+ employees.",
    longdesc: `<p>KTC Edibles Ltd. is one of the UK's largest suppliers and manufacturers of edible oils, canned groceries, and condiments.</p>

    <p>As a Data Engineer & Analyst, I engineered automated database infrastructure by replacing manual CSV workflows with SQL-based ETL pipelines, CRM ingestion scripts, agent scheduling, and validation processes — eliminating 16+ hours of weekly manual work and enabling real-time reporting for 80+ employees. I also enhanced BI capabilities across dashboards and data models. My responsibilities included:</p>
    
    <ul>
        <li>Participating in Master Data meetings to discuss database status and requirements.</li>
        <li>Producing project proposals to outline future requirements for assets.</li>
        <li>Conducting data modelling to identify and document the existing database relationships.</li>
        <li>Identifying and rectifying data anomalies or duplicates to improve data quality/accuracy.</li>
        <li>Establishing optimal data architecture for a Business Insight database in the company's SQL environment.</li>
        <li>Developing and defining scripts to validate and update pending sale data against invoices.</li>
        <li>Development of automation scripts for data input from Access CRM into the new database.</li>
        <li>Scheduling automated jobs to execute data scripts at staggered intervals from midnight.</li>
        <li>Documentation of locally-stored versus system-stored data.</li>
        <li>Compiling a Data Dictionary detailing data attributes, locations, and the responsible personnel for data handling in the case of potential future changes.</li>
        <li>Designing an updated dynamic sales BI dashboard for advanced reporting.</li>
        <li>Development and implementation of Excel VBA scripts for end-user data input to SQL database.</li>
        <li>Implementation of change auditing for end-user input forms.</li>
        <li>Implementing Row Level Security features to control dashboard access based on individual role/responsibilities.</li>
        <li>Delivered a 93% improvement in reported user satisfaction and reporting efficiency through the combined infrastructure and BI enhancements.</li>
    </ul>
     `,
    skills:
      "Analytical Skills · Interpreting Data · Databases · Visual Basic for Applications (VBA) · Microsoft Excel · Microsoft Power BI · SQL",
    logo: logoKTC,
  },
  {
    id: 3,
    title: "Data Science Intern // Datern",
    location: "Remote",
    shortdesc:
      "Datern programme included SQL, PowerBI, and Python for Data Analysis. Contributed through data insight extractions, data cleaning and processing, impactful visualizations, utilisation of web scraping and machine learning techniques, and active participation in team meetings and discussions.",
    longdesc: `<p>As a Data Science Intern at Datern, a company specializing in data science training, I was immersed in an environment dedicated to developing the foundational skills of data analysis. The internship provided a practical and comprehensive understanding of various tools and techniques essential in the field of data science. My training and responsibilities included:</p>

    <ul>
        <li>Utilizing SQL, PowerBI, and Python for advanced data analysis tasks.</li>
        <li>Extracting meaningful insights from large and complex datasets.</li>
        <li>Performing data cleaning and preprocessing to enhance data quality and integrity.</li>
        <li>Applying web scraping techniques to collect data from various online sources.</li>
        <li>Implementing machine learning algorithms to analyze data trends and patterns.</li>
        <li>Creating intuitive and insightful data visualizations and presentations using PowerBI.</li>
        <li>Actively contributing to team meetings and discussions, offering data-driven perspectives and solutions.</li>
    </ul>
    `,
    skills:
      "Analytical Skills · Interpreting Data · Databases · Python (Programming Language) · Microsoft Power BI · SQL",
    logo: logoDATERN,
  },
  {
    id: 4,
    title: "Skills Co-Creator & Senior Ambassador // University of Bath",
    location: "Bath, England, United Kingdom | Hybrid",
    shortdesc:
      "Collaborated on the improvement and promotion of resources for the University's Skill Centre. Largely focused on program design, content review, and video creation on various topics.",
    longdesc: `<p>As a Skills Co-Creator and Senior Student Ambassador at the University of Bath's Skill Centre, I was part of a dynamic team dedicated to developing and enhancing skill-building resources for student groups. My role involved in-depth research, creative design, and effective communication to bridge skill gaps among students. Key responsibilities and tasks included:</p>

    <ul>
        <li>Organizing and assisting with focus groups to collect student feedback on various resources.</li>
        <li>Writing informative blog posts to highlight the available resources and their benefits, based on personal experiences.</li>
        <li>Reviewing and enhancing existing content and designs for resources and social media posts to improve student appeal and increase page traffic.</li>
        <li>Contributing to the creation of engaging video content on diverse topics, including exam preparation and mental health awareness.</li>
    </ul>
    `,
    skills:
      "Management · Analytical Skills · Interpreting Data · Databases · Constructive Feedback · User Experience Testing · Community Outreach · Research · Communication",
    logo: logoSkillsCoCreator,
  },
  {
    id: 5,
    title: "Chair // University of Bath African-Caribbean Society",
    location: "Bath, England, United Kingdom",
    shortdesc:
      "Directed the ACS within external and internal contexts, overseeing committee affairs, ensuring member wellbeing, managing finances, organizing events, and representing the student group in marketing and communication concerns.",
    longdesc: `<p>As the Chair of the University of Bath African & Caribbean Society, I played a pivotal role in overseeing the society's functions, focusing on the education, entertainment, and empowerment of individuals from diverse backgrounds, particularly emphasizing Afro-Caribbean culture. My responsibilities were geared towards enriching student experiences and effectively managing the society's activities and goals. Key duties included:</p>

    <ul>
        <li>Ensuring the wellbeing of committee members and the society as a whole.</li>
        <li>Collaborating with the Treasurer for efficient management of society funds and overseeing financial transactions.</li>
        <li>Liaising with the Student Union and other societies for organizing various events, talks, and outings.</li>
        <li>Engaging in external communication with other universities and businesses for sponsorships and joint affairs.</li>
        <li>Distributing workload among the committee members to maintain an efficient workflow and foster a supportive team environment.</li>
        <li>Representing the society in various forums, handling marketing, and managing communications.</li>
    </ul>
    `,
    skills:
      "Management · Analytical Skills · Fundraising · Strategic Planning · Event Management · Communication · Team Leadership · External Relations · Community Engagement",
    logo: logoACSChair,
  },
  {
    id: 6,
    title: "Architectural Assistant // Foster + Partners",
    location: "London, England, United Kingdom",
    shortdesc:
      "Contributed as part of a team responsible for the design of hotel section of a large-scale resort project in the Middle East. Utilized CAD and BIM modelling software, generated 3D renders, and designed distribution diagrams.",
    longdesc: `<p>At Foster + Partners, a globally recognized architectural and engineering practice known for sustainable commercial design, I served as an Architectural Assistant. My role encompassed various stages of architectural design, from conceptualization to schematic design, specifically focusing on the hotel section of a major resort project in the Middle East. My duties were diverse, emphasizing both creative and technical aspects of architectural design. Responsibilities included:</p>

    <ul>
        <li>Working with CAD and Revit BIM modelling software to create detailed plans and 3D models.</li>
        <li>Designing room and circulation layouts in accordance with specified area programs.</li>
        <li>Optimizing atrium designs to enhance natural lighting for planting and ground-floor areas.</li>
        <li>Producing high-quality renders and visuals using Enscape.</li>
        <li>Organizing and exporting architectural plans, elevations, and sections in Revit.</li>
        <li>Creating artistic and realistic rendered plans using Adobe Photoshop.</li>
        <li>Developing distribution diagrams and compiling reports using Adobe InDesign.</li>
        <li>Constructing hand-made physical models for client meetings and presentations.</li>
        <li>Participating in various coordination meetings including design, visualization, and structural discussions.</li>
    </ul>
    `,
    skills:
      "Adobe Photoshop · Adobe InDesign · Adobe Illustrator · Autodesk AutoCAD 2022 · Autodesk Revit 2022 · Rhinoceros 3D V7 · Enscape · Analytical Skills",
    logo: logoFP,
  },
  {
    id: 7,
    title: "Architectural Assistant // RS Architects",
    location: "Barnet, England, United Kingdom",
    shortdesc:
      "Handled tasks ranging production of sketches, CAD development, and planning submission for residential projects. Further undertook general office management responsibilities.",
    longdesc: `<p>At RS Architects, a contemporary multi-disciplinary architectural practice specializing in residential and commercial projects in Greater London, I functioned as an Architectural Assistant. My role entailed close collaboration with the director on various architectural projects including extensions, conversions, and refurbishments of residential buildings. My responsibilities encompassed a range of creative and technical tasks, including:</p>

    <ul>
        <li>Creating high-quality sketches, renderings, and graphics for client presentations.</li>
        <li>Producing detailed CAD drawings of existing buildings using surveyed measurements.</li>
        <li>Managing the cataloguing of drawings for planning submissions, and preparing planning letters and drawing registers.</li>
        <li>Overseeing the completion of planning application submissions and liaising with authorities for statutory approval documentation.</li>
        <li>Collaborating with multidisciplinary team members, including structural and civil engineers, to coordinate architectural projects.</li>
        <li>Handling office management tasks, responding to web enquiries from potential clients, and organizing client engagement.</li>
        <li>Using Adobe Photoshop to digitally enhance photography of ongoing or completed projects for the practice’s website.</li>
    </ul>
    `,
    skills:
      "Analytical Skills · Adobe Photoshop · AutoCAD · Client Engagement · Project Coordination · Planning and Design · Technical Documentation",
    logo: logoRS,
  },
  {
    id: 8,
    title: "RIBA Mentee (Internship) // Allford Hall Monoghan Morris",
    location: "Bristol, England, United Kingdom",
    shortdesc: "Mentee Future Architect.",
    longdesc: `<p>As a mentee in the RIBA Future Architects mentoring scheme, a program run in partnership with schools of architecture and practices, I gained invaluable insights into the architectural profession. This opportunity at Allford Hall Monaghan Morris (AHMM) allowed me to understand the practical aspects of working as an architect and to receive guidance on career goals and skill development. My experience included:</p>

    <ul>
        <li>Being introduced to life in practice and receiving practical advice on working as an architect.</li>
        <li>Receiving tailored advice and guidance to reflect on my future goals and ambitions in the field.</li>
        <li>Developing key skills and accessing one-on-one support from my RIBA tutor.</li>
        <li>Getting the opportunity to view ongoing projects at AHMM and understanding the various stages of design.</li>
    </ul>
    
    <p>For more details, see my <a href='https://www.linkedin.com/in/favourdo/details/experience/1612798006841/single-media-viewer/?profileId=ACoAACmhpvMB9MywAsViJ_T-Bq76dnz12-1Zx6c'>Certification</a>.</p>
    `,
    skills: "",
    logo: logoAHMM,
  },
];

const TITLE_SEPARATOR = ' // ';

function parseExperienceTitle(title) {
  const idx = title.indexOf(TITLE_SEPARATOR);
  if (idx === -1) {
    return { role: title, company: null };
  }
  return {
    role: title.slice(0, idx).trim(),
    company: title.slice(idx + TITLE_SEPARATOR.length).trim(),
  };
}

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

  const handleExperienceClick = (experience) => {
    const { role, company } = parseExperienceTitle(experience.title);
    const modalTitle = company ? `${role} at ${company}` : role;
    openModal(<ExperienceModalContent experience={experience} />, { title: modalTitle });
  };

  const ExperienceModalContent = ({ experience }) => {
    const { role, company } = parseExperienceTitle(experience.title);

    return (
    <div className="experience-modal-content">
      <div className="experience-list-modal">
        {experiences.map((exp) => {
          const parsed = parseExperienceTitle(exp.title);
          return (
          <button
            key={exp.id}
            type="button"
            className={`experience-item-modal ${exp.id === experience.id ? 'active' : ''}`}
            onClick={() => handleExperienceClick(exp)}
            aria-current={exp.id === experience.id ? 'true' : undefined}
          >
            <span className="experience-item-modal__role">{parsed.role}</span>
            {parsed.company && (
              <span className="experience-item-modal__company">{parsed.company}</span>
            )}
          </button>
          );
        })}
      </div>
      <div className="experience-detail-modal">
        <header className="modal-header">
          <img
            src={experience.logo}
            alt=""
            className="company-logo"
            aria-hidden="true"
          />
          <ExperienceHeading role={role} company={company} location={experience.location} />
        </header>
        {experience.skills && (
          <section className="experience-skills" aria-label="Skills">
            <span className="experience-section-label">Skills</span>
            <p className="experience-skills__list">{experience.skills}</p>
          </section>
        )}

        <section
          className="experience-body"
          dangerouslySetInnerHTML={{ __html: experience.longdesc }}
        />

      </div>
    </div>
    );
  };

  return (
    <div className="experience-container">
      <ul className="experience-list">
        {experiences.map((exp) => {
          const { role, company } = parseExperienceTitle(exp.title);
          const ariaLabel = company ? `${role} at ${company}` : role;

          return (
          <li key={exp.id} className="experience-item">
            <button
              type="button"
              className="experience-item-button"
              onClick={() => handleExperienceClick(exp)}
              aria-label={`View details for ${ariaLabel}`}
            >
            <div className="experience-title">
              <span className="experience-title__role">{role}</span>
              {company && <span className="experience-title__company">{company}</span>}
            </div>
            <div className="experience-shortdesc">{exp.shortdesc}</div>
            <div className="experience-location">{exp.location}</div>
            </button>
          </li>
          );
        })}
      </ul>
    </div>
  );
}