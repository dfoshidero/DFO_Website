// One query for the whole site: every card's content in a single round trip, so
// the layout randomiser can run once with all data present.

const ASSET = '{ "url": asset->url, "extension": asset->extension, "mimeType": asset->mimeType }';

export const CONTENT_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    fullName, tagline, contactEmail,
    linkedinUrl, githubUrl, recommendationsMoreUrl, projectsMoreUrl,
    cvDownloadName, timezoneLabel, timezoneIana, copyrightName, status,
    "profileIcon": profileIcon${ASSET},
    "cvFile": cvFile${ASSET}
  },
  "ui": *[_id == "uiText"][0]{
    cardTitles, header, footer, cardExtras, projects, experience,
    education, skills, contact, portfolio, inquiryForm, meta
  },
  "projects": *[_type == "project"] | order(orderRank) {
    _id, title, description, stack, projectUrl, videoUrl, featured,
    "image": image${ASSET}
  },
  "experiences": *[_type == "experience"] | order(orderRank) {
    _id, role, company, location, shortDescription, longDescription, skills,
    "logo": logo${ASSET}
  },
  "educations": *[_type == "education"] | order(orderRank) {
    _id, title, kind, school, location, graduation, achieved, link
  },
  "skills": *[_type == "skill"] | order(orderRank) {
    _id, name, certified, completed, link
  },
  "recommendations": *[_type == "recommendation"] | order(orderRank) {
    _id, text, recommender, role
  }
}`;

export function isUsableContent(content) {
  if (!content) return false;
  if (!content.settings || !content.ui) return false;
  return ['projects', 'experiences', 'educations', 'skills', 'recommendations'].every(
    (key) => Array.isArray(content[key]) && content[key].length > 0
  );
}
