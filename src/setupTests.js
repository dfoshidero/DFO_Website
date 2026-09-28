// Adds jest-dom's matchers (toBeInTheDocument and friends). CRA loads this
// automatically before each test file.
import '@testing-library/jest-dom';

// jsdom in CRA's jest 27 predates TextEncoder/TextDecoder being globals, which
// react-router v7 expects. Browsers and the webpack build both have them.
import { TextDecoder, TextEncoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
