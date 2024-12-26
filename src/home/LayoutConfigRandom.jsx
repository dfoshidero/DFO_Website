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
import SkillsCard from "../content/expertise/Skills";

import StatusCircle from "../content/status/StatusCircle";
import SeeMore from "../components/seemore-button/SeeMore";

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
    { columns: 2, rows: 1 },
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
  "TECHNICAL SKILLS": [
    { columns: 1, rows: 2 },
    { columns: 1, rows: 1 },
  ], // Will include skills and certifications. CERTIFIED SKILLS go first.
};

// Function to check if the layout has at least two cards from [TIMEZONE, STATUS, CONNECT] in the first three rows for mobile layout
const isValidSpecialCardsPlacement = (layout) => {
	const specialCardTypes = ["TIMEZONE", "STATUS", "CONNECT"];
	let count = 0;

	layout.forEach((item) => {
		if (
			specialCardTypes.includes(item.cardType) &&
			item.position.rowStart <= 3
		) {
			count++;
		}
	});

	return count >= 1;
};

// Function to generate a random layout
const generateRandomLayout = (gridColumns, gridRows) => {
	const cardTypeKeys = Object.keys(cardTypes);
	let layout, grid, attempt, allCardTypesUsed, layoutValid;

	do {
		layout = [];
		grid = Array(gridRows)
			.fill()
			.map(() => Array(gridColumns).fill(false));
		attempt = true;
		allCardTypesUsed = true;

		for (let row = 1; row <= gridRows && attempt; row++) {
			for (let col = 1; col <= gridColumns && attempt; col++) {
				if (!grid[row - 1][col - 1]) {
					const availableOptions = getAvailableCardTypesAndSizes(
						cardTypeKeys,
						layout,
						row,
						col,
						grid,
						gridColumns,
						gridRows
					);
					if (availableOptions.length === 0) {
						attempt = false;
						allCardTypesUsed = false;
					} else {
						const { cardType, size } = selectRandomElement(availableOptions);
						const position = { columnStart: col, rowStart: row };

						layout.push({ cardType, size, position });
						updateGrid(grid, position, size);
					}
				}
			}
		}

		// Check if all card types have been used
		if (allCardTypesUsed) {
			const usedCardTypes = layout.map((item) => item.cardType);
			allCardTypesUsed = cardTypeKeys.every((cardType) =>
				usedCardTypes.includes(cardType)
			);
		}

		// Additional check for special card placement if gridRows === 12
		layoutValid = gridRows !== 12 || isValidSpecialCardsPlacement(layout);
	} while (!allCardTypesUsed || !layoutValid);

	return layout;
};

// Function to get available card types that can fit in the current position
const getAvailableCardTypesAndSizes = (
	cardTypeKeys,
	layout,
	row,
	col,
	grid,
	gridColumns,
	gridRows
) => {
	let availableOptions = [];
	const usedCardTypes = layout.map((item) => item.cardType);

	cardTypeKeys.forEach((cardType) => {
		if (!usedCardTypes.includes(cardType)) {
			cardTypes[cardType].forEach((size) => {
				// Exclude specific card sizes when gridRows is 12
				if (
					gridRows === 12 &&
					((cardType === "EDUCATION & CERTIFICATIONS" &&
						size.columns === 2 &&
						size.rows === 2) ||
						(cardType === "STATUS" && size.columns === 2 && size.rows === 1))
				) {
					return;
				}

				if (
					gridRows === 4 &&
					cardType === "EDUCATION & CERTIFICATIONS" &&
					size.columns === 1 &&
					size.rows === 2
				) {
					return;
				}

				if (
					isValidPosition(
						size,
						{ columnStart: col, rowStart: row },
						layout,
						grid,
						gridColumns,
						gridRows
					)
				) {
					availableOptions.push({ cardType, size });
				}
			});
		}
	});

	return availableOptions;
};

// Function to update the grid marking the occupied cells
const updateGrid = (grid, position, size) => {
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
			grid[row - 1][col - 1] = true;
		}
	}
};

// Updated function to check if the position is valid for the given size
const isValidPosition = (
	size,
	position,
	currentLayout,
	grid,
	gridColumns,
	gridRows
) => {
	const columnEnd = position.columnStart + size.columns - 1;
	const rowEnd = position.rowStart + size.rows - 1;

	// Check if a 2x2 card is being placed in the first row when gridRows is 12
	if (
		gridRows === 12 &&
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
				// Check if the cell is already occupied
				return false;
			}
		}
	}

	return true;
};

// Function to select a random element from an array
const selectRandomElement = (array) => {
	return array[Math.floor(Math.random() * array.length)];
};

const allowAutoScroll = ["MY WORK(S)", "TECHNICAL SKILLS"];

// Function to generate layout components based on the random layout
export const generateLayoutComponents = (gridColumns, gridRows) => {
	let layoutConfigurations = generateRandomLayout(gridColumns, gridRows);

	return layoutConfigurations.map((config, index) => {
		const cardClasses = `card ${config.size.columns}-columns ${config.size.rows}-rows`;
		// Define a delay based on the card's index
		const animationDelay = index * 0.1; // Adjust the multiplier to control the speed

		let extraContent;

		switch (config.cardType) {
			case "TIMEZONE":
				extraContent = "Midlands, UK";
				break;
			case "STATUS":
				//lightgreen
				//orange
				//red
				extraContent = <StatusCircle color="red" />;
				break;
			case "RECOMMENDATIONS":
				extraContent = (
					<SeeMore
						url="https://www.linkedin.com/in/favourdo/details/recommendations/?detailScreenTabIndex=0"
						text="READ MORE"
					/>
				);
				break;
			case "PROJECTS":
				extraContent = (
					<SeeMore
						url="https://github.com/dfoshidero?tab=repositories"
						text="VIEW REPOSITORIES"
					/>
				);
				break;
			case "MY WORK(S)":
				extraContent = (
					<div style={{ display: "flex", flexDirection: "row" }}>
						<SeeMore
							url="https://www.instagram.com/untitled.fvr/"
							text="PORTFOLIO"
							style={{ marginRight: "10px" }} // Optional margin between components
						/>{" "}
					</div>
				);
				break;
			default:
				extraContent = null;
		}

		const shouldScroll = allowAutoScroll.includes(config.cardType);

		return () => (
			<Card
				key={index} // Add a unique key for each card
				title={config.cardType.toUpperCase()}
				extra={extraContent}
				className={cardClasses}
				style={{
					gridColumn: `span ${config.size.columns}`,
					gridRow: `span ${config.size.rows}`,
					// Apply the animation delay
					animationDelay: `${animationDelay}s`,
				}}
				scroll={shouldScroll}
			>
				{/* Render card content based on cardType */}
				{config.cardType === "EXPERIENCE" && <ExperienceCard />}
				{config.cardType === "EDUCATION & CERTIFICATIONS" && <EducationCard />}
				{config.cardType === "TIMEZONE" && <AnalogClock />}
				{config.cardType === "PROJECTS" && <ProjectCard />}
				{config.cardType === "STATUS" && <StatusCard />}
				{config.cardType === "MY WORK(S)" && <PortfolioCard />}
				{config.cardType === "CONNECT" && <ContactCard />}
				{config.cardType === "RECOMMENDATIONS" && <RecommendationCard />}
				{config.cardType === "TECHNICAL SKILLS" && <SkillsCard />}
			</Card>
		);
	});
};
