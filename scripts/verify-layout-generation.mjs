/**
 * Smoke test for layout generation (mirrors LayoutConfigRandom.jsx algorithm).
 * Run: node scripts/verify-layout-generation.mjs
 */

const cardTypes = {
  EXPERIENCE: [
    { columns: 2, rows: 3 },
    { columns: 2, rows: 2 },
  ],
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
      if (!grid[row][col]) return { row: row + 1, col: col + 1 };
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

  if (columnEnd > gridColumns || rowEnd > gridRows) return false;

  for (let r = position.rowStart; r <= rowEnd; r++) {
    for (let c = position.columnStart; c <= columnEnd; c++) {
      if (grid[r - 1][c - 1]) return false;
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

  if (
    gridRows === MOBILE_GRID_ROWS &&
    !specialInTopRows &&
    row > MOBILE_SPECIAL_TOP_ROW &&
    hasUnusedSpecialCard(placedSet)
  ) {
    return options;
  }

  const restrictToSpecialCards =
    gridRows === MOBILE_GRID_ROWS &&
    !specialInTopRows &&
    row <= MOBILE_SPECIAL_TOP_ROW &&
    hasUnusedSpecialCard(placedSet) &&
    row === MOBILE_SPECIAL_TOP_ROW;

  for (const cardType of CARD_TYPE_KEYS) {
    if (placedSet.has(cardType)) continue;
    if (restrictToSpecialCards && !SPECIAL_CARD_TYPES.includes(cardType)) continue;

    for (const size of cardTypes[cardType]) {
      if (isSizeExcluded(cardType, size, gridRows)) continue;
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
    if (nextCell !== null) return false;
    if (gridRows === MOBILE_GRID_ROWS && !specialInTopRows) return false;
    return true;
  }

  const nextCell = findNextEmptyCell(grid);
  if (!nextCell) return false;

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

    if (
      placeBacktrack(
        layout,
        grid,
        placedSet,
        gridColumns,
        gridRows,
        specialInTopRows || isSpecialInTop
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

  if (
    placeBacktrack(layout, grid, placedSet, gridColumns, gridRows, false)
  ) {
    return layout;
  }
  return generateRandomLayout(gridColumns, gridRows);
};

const validateLayout = (layout, gridColumns, gridRows) => {
  const grid = createEmptyGrid(gridRows, gridColumns);
  const types = new Set();
  let area = 0;
  let specialInTop = false;

  for (const { cardType, size, position } of layout) {
    types.add(cardType);
    area += size.columns * size.rows;

    if (
      SPECIAL_CARD_TYPES.includes(cardType) &&
      position.rowStart <= MOBILE_SPECIAL_TOP_ROW
    ) {
      specialInTop = true;
    }

    if (!isValidPosition(size, position, grid, gridColumns, gridRows)) {
      return { ok: false, reason: "overlap or OOB" };
    }
    setGridOccupied(grid, position, size, true);
  }

  if (types.size !== CARD_TYPE_KEYS.length) {
    return { ok: false, reason: "missing card types" };
  }
  if (area !== gridColumns * gridRows) {
    return { ok: false, reason: `area ${area} != ${gridColumns * gridRows}` };
  }
  if (gridRows === MOBILE_GRID_ROWS && !specialInTop) {
    return { ok: false, reason: "mobile special not in top rows" };
  }
  if (findNextEmptyCell(grid) !== null) {
    return { ok: false, reason: "grid not full" };
  }

  return { ok: true };
};

const GRIDS = [
  { name: "desktop", gridColumns: 6, gridRows: 4 },
  { name: "intermediate", gridColumns: 4, gridRows: 6 },
  { name: "mobile", gridColumns: 2, gridRows: 12 },
];

const RUNS = 200;
let failed = false;

for (const { name, gridColumns, gridRows } of GRIDS) {
  const start = performance.now();
  for (let i = 0; i < RUNS; i++) {
    const layout = generateRandomLayout(gridColumns, gridRows);
    const result = validateLayout(layout, gridColumns, gridRows);
    if (!result.ok) {
      console.error(`FAIL [${name}] run ${i}: ${result.reason}`);
      failed = true;
      break;
    }
  }
  const ms = (performance.now() - start).toFixed(1);
  console.log(`OK [${name}] ${RUNS} layouts in ${ms}ms`);
}

process.exit(failed ? 1 : 0);
