// The layout module pulls in cards, which reach @sanity/client (ESM-only).
// The generator itself needs none of it.
jest.mock('@sanity/client', () => ({ createClient: () => null }));

import { generateLayout } from './LayoutConfigRandom';

// The generator retries on failure, so an unsatisfiable set of card sizes would
// recurse until the stack blows rather than returning. These cases pin down that
// every breakpoint can still be tiled exactly, for both status-line counts.
const BREAKPOINTS = [
  { name: 'desktop', columns: 6, rows: 4 },
  { name: 'intermediate', columns: 4, rows: 6 },
  { name: 'mobile', columns: 2, rows: 12 },
];

const CARD_COUNT = 9;

describe.each(BREAKPOINTS)('$name layout ($columns x $rows)', ({ columns, rows }) => {
  test.each([1, 2, 3])('solves with %i status line(s)', (statusLines) => {
    for (let i = 0; i < 25; i++) {
      const layout = generateLayout(columns, rows, statusLines);

      expect(layout).toHaveLength(CARD_COUNT);

      // Every cell is used exactly once.
      const cells = layout.reduce((n, c) => n + c.size.columns * c.size.rows, 0);
      expect(cells).toBe(columns * rows);

      // Nothing hangs off the edge of the grid.
      for (const { size, position } of layout) {
        expect(position.columnStart + size.columns - 1).toBeLessThanOrEqual(columns);
        expect(position.rowStart + size.rows - 1).toBeLessThanOrEqual(rows);
      }
    }
  });
});

test('a single status line never produces a wide status card', () => {
  for (let i = 0; i < 40; i++) {
    const status = generateLayout(6, 4, 1).find((c) => c.cardType === 'STATUS');
    expect(status.size).toEqual({ columns: 1, rows: 1 });
  }
});

test('education is never narrower than 2x2', () => {
  for (const { columns, rows } of BREAKPOINTS) {
    for (let i = 0; i < 15; i++) {
      const ed = generateLayout(columns, rows, 2)
        .find((c) => c.cardType === 'EDUCATION & CERTIFICATIONS');
      expect(ed.size.rows).toBeGreaterThanOrEqual(2);
    }
  }
});
