// LayoutConfigRandom.js
import React from "react";
import Card from "../components/card/Card";
import ExperienceCard from "../content/experience/Experience";
import EducationCard from "../content/education/Education";
import AnalogClock from "../content/time/analog/AnalogClock";
import ProjectCard from "../content/projects/Projects";
import StatusCard from "../content/status/Status";
import PortfolioCard from "../content/portfolio/Portfolio";
import ContactCard from "../content/contact/Contact";
import RecommendationCard from "../content/recommendations/Recommendation";
import SkillsCard, {
  SkillsFilterControls,
  SkillsFilterProvider,
} from "../content/expertise/Skills";

import StatusIndicator from "../content/status/StatusIndicator";
import SeeMore from "../components/seemore-button/SeeMore";
import Reload from "../components/reload-button/Reload";

// Define the possible sizes for each card type
const cardTypes = {
  EXPERIENCE: [
    { columns: 2, rows: 3 },
    { columns: 2, rows: 2 },
  ], // Now an array of sizes
  TIMEZONE: [{ columns: 1, rows: 1 }],
  CONNECT: [{ columns: 1, rows: 1 }],
  PROJECTS: [
    { columns: 2, rows: 2 },
    { columns: 2, rows: 3 },
  ],
  "MY WORK(S)": [
    { columns: 2, rows: 2 },
  ],
  "EDUCATION & CERTIFICATIONS": [
    { columns: 2, rows: 1 },
    { columns: 2, rows: 2 },
  ],
  RECOMMENDATIONS: [{ columns: 2, rows: 1 }],
  STATUS: [
    { columns: 2, rows: 1 },
    { columns: 1, rows: 1 },
  ],
  SKILLS: [
    { columns: 1, rows: 2 },
    { columns: 1, rows: 1 },
  ],
};

const CARD_TYPE_KEYS = Object.keys(cardTypes);
const SPECIAL_CARD_TYPES = ["TIMEZONE", "STATUS", "CONNECT"];
const MOBILE_GRID_ROWS = 12;
const MOBILE_SPECIAL_TOP_ROW = 3;

const shuffleArray = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const createEmptyGrid = (gridRows, gridColumns) =>
  Array.from({ length: gridRows }, () => Array(gridColumns).fill(false));

const findNextEmptyCell = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (!grid[row][col]) {
        return { row: row + 1, col: col + 1 };
      }
    }
  }
  return null;
};

const isSizeExcluded = (cardType, size, gridRows) => {
  if (
    gridRows === MOBILE_GRID_ROWS &&
    ((cardType === "EDUCATION & CERTIFICATIONS" &&
      size.columns === 2 &&
      size.rows === 2) ||
      (cardType === "STATUS" && size.columns === 2 && size.rows === 1))
  ) {
    return true;
  }
  return false;
};

const isValidPosition = (size, position, grid, gridColumns, gridRows) => {
  const columnEnd = position.columnStart + size.columns - 1;
  const rowEnd = position.rowStart + size.rows - 1;

  if (
    gridRows === MOBILE_GRID_ROWS &&
    size.columns === 2 &&
    size.rows === 2 &&
    position.rowStart === 1
  ) {
    return false;
  }

  if (columnEnd > gridColumns || rowEnd > gridRows) {
    return false;
  }

  for (let r = position.rowStart; r <= rowEnd; r++) {
    for (let c = position.columnStart; c <= columnEnd; c++) {
      if (grid[r - 1][c - 1]) {
        return false;
      }
    }
  }

  return true;
};

const setGridOccupied = (grid, position, size, occupied) => {
  for (
    let row = position.rowStart;
    row < position.rowStart + size.rows;
    row++
  ) {
    for (
      let col = position.columnStart;
      col < position.columnStart + size.columns;
      col++
    ) {
      grid[row - 1][col - 1] = occupied;
    }
  }
};

const hasUnusedSpecialCard = (placedSet) =>
  SPECIAL_CARD_TYPES.some((cardType) => !placedSet.has(cardType));

const getAvailableCardTypesAndSizes = (
  row,
  col,
  grid,
  placedSet,
  gridColumns,
  gridRows,
  specialInTopRows
) => {
  const position = { columnStart: col, rowStart: row };
  const options = [];

  const mustPlaceSpecialInTopRows =
    gridRows === MOBILE_GRID_ROWS &&
    !specialInTopRows &&
    row > MOBILE_SPECIAL_TOP_ROW &&
    hasUnusedSpecialCard(placedSet);

  if (mustPlaceSpecialInTopRows) {
    return options;
  }

  const restrictToSpecialCards =
    gridRows === MOBILE_GRID_ROWS &&
    !specialInTopRows &&
    row <= MOBILE_SPECIAL_TOP_ROW &&
    hasUnusedSpecialCard(placedSet) &&
    row === MOBILE_SPECIAL_TOP_ROW;

  for (const cardType of CARD_TYPE_KEYS) {
    if (placedSet.has(cardType)) {
      continue;
    }

    if (restrictToSpecialCards && !SPECIAL_CARD_TYPES.includes(cardType)) {
      continue;
    }

    for (const size of cardTypes[cardType]) {
      if (isSizeExcluded(cardType, size, gridRows)) {
        continue;
      }

      if (isValidPosition(size, position, grid, gridColumns, gridRows)) {
        options.push({ cardType, size });
      }
    }
  }

  return options;
};

const placeBacktrack = (
  layout,
  grid,
  placedSet,
  gridColumns,
  gridRows,
  specialInTopRows
) => {
  if (placedSet.size === CARD_TYPE_KEYS.length) {
    const nextCell = findNextEmptyCell(grid);
    if (nextCell !== null) {
      return false;
    }
    if (gridRows === MOBILE_GRID_ROWS && !specialInTopRows) {
      return false;
    }
    return true;
  }

  const nextCell = findNextEmptyCell(grid);
  if (!nextCell) {
    return false;
  }

  const { row, col } = nextCell;
  const options = shuffleArray(
    getAvailableCardTypesAndSizes(
      row,
      col,
      grid,
      placedSet,
      gridColumns,
      gridRows,
      specialInTopRows
    )
  );

  for (const { cardType, size } of options) {
    const position = { columnStart: col, rowStart: row };
    const placement = { cardType, size, position };
    const isSpecialInTop =
      SPECIAL_CARD_TYPES.includes(cardType) && row <= MOBILE_SPECIAL_TOP_ROW;

    layout.push(placement);
    placedSet.add(cardType);
    setGridOccupied(grid, position, size, true);

    const nextSpecialInTopRows = specialInTopRows || isSpecialInTop;

    if (
      placeBacktrack(
        layout,
        grid,
        placedSet,
        gridColumns,
        gridRows,
        nextSpecialInTopRows
      )
    ) {
      return true;
    }

    layout.pop();
    placedSet.delete(cardType);
    setGridOccupied(grid, position, size, false);
  }

  return false;
};

const generateRandomLayout = (gridColumns, gridRows) => {
  const grid = createEmptyGrid(gridRows, gridColumns);
  const layout = [];
  const placedSet = new Set();

  const solved = placeBacktrack(
    layout,
    grid,
    placedSet,
    gridColumns,
    gridRows,
    false
  );

  if (!solved) {
    console.warn(
      "[LayoutConfigRandom] Failed to generate a valid layout; retrying."
    );
    return generateRandomLayout(gridColumns, gridRows);
  }

  return layout;
};

export const generateLayout = (gridColumns, gridRows) =>
	generateRandomLayout(gridColumns, gridRows);

const getExtraContent = (cardType) => {
	switch (cardType) {
		case "TIMEZONE":
			return "London, UK";
		case "STATUS":
			return <StatusIndicator />;
		case "RECOMMENDATIONS":
			return (
				<div style={{ display: "flex", flexDirection: "row" }}>
					<Reload />
					|
					<SeeMore
						url="https://www.linkedin.com/in/favourdo/details/recommendations/?detailScreenTabIndex=0"
						text="READ MORE"
					/>
				</div>
			);
		case "PROJECTS":
			return (
				<SeeMore
					url="https://github.com/dfoshidero?tab=repositories"
					text="VIEW REPOSITORIES"
				/>
			);
		case "MY WORK(S)":
			return (
				<div style={{ display: "flex", flexDirection: "row" }}>
					<SeeMore
						url="https://www.instagram.com/untitled.fvr/"
						text="PORTFOLIO"
						style={{ marginRight: "10px" }}
					/>{" "}
				</div>
			);
		case "SKILLS":
			return <SkillsFilterControls />;
		default:
			return null;
	}
};

const renderCardContent = (cardType) => {
	switch (cardType) {
		case "EXPERIENCE":
			return <ExperienceCard />;
		case "EDUCATION & CERTIFICATIONS":
			return <EducationCard />;
		case "TIMEZONE":
			return <AnalogClock />;
		case "PROJECTS":
			return <ProjectCard />;
		case "STATUS":
			return <StatusCard />;
		case "MY WORK(S)":
			return <PortfolioCard />;
		case "CONNECT":
			return <ContactCard />;
		case "RECOMMENDATIONS":
			return <RecommendationCard />;
		case "SKILLS":
			return <SkillsCard />;
		default:
			return null;
	}
};

export function LayoutCard({ config, animationDelay = 0, animateEntrance = true }) {
	const { cardType, size } = config;
	const cardClasses = [
		"card",
		`${size.columns}-columns`,
		`${size.rows}-rows`,
		!animateEntrance && "card--no-entrance",
	]
		.filter(Boolean)
		.join(" ");

	const cardStyle = {
		gridColumn: `span ${size.columns}`,
		gridRow: `span ${size.rows}`,
		...(animateEntrance && { animationDelay: `${animationDelay}s` }),
	};

	const card = (
		<Card
			title={cardType.toUpperCase()}
			extra={getExtraContent(cardType)}
			className={cardClasses}
			style={cardStyle}
		>
			{renderCardContent(cardType)}
		</Card>
	);

	if (cardType === "SKILLS") {
		return <SkillsFilterProvider>{card}</SkillsFilterProvider>;
	}

	return card;
}