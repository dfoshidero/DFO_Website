// @sanity/client is ESM-only; the provider falls back to the bundled snapshot
// when the live fetch never settles, which is what this renders against.
jest.mock('@sanity/client', () => ({
  createClient: () => ({ fetch: () => new Promise(() => {}) }),
}));

import { render, screen } from '@testing-library/react';
import App from './App';
import snapshot from './content/snapshot.json';

// jsdom implements neither of these; Home uses both while measuring the layout.
beforeAll(() => {
  Object.defineProperty(document, 'fonts', {
    value: { ready: Promise.resolve() },
    configurable: true,
  });
});

test('renders the page from content', () => {
  render(<App />);

  // Header comes from siteSettings.
  expect(screen.getByText(snapshot.settings.fullName)).toBeInTheDocument();
  expect(screen.getByText(snapshot.settings.tagline)).toBeInTheDocument();

  // The layout is randomised, so assert the cards that are always placed.
  expect(screen.getByText(snapshot.settings.timezoneLabel)).toBeInTheDocument();
  expect(
    screen.getByText(new RegExp(snapshot.settings.copyrightName))
  ).toBeInTheDocument();
});
