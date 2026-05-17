import React from 'react';
import ReactDOM from 'react-dom/client';
import { applyTheme, getInitialTheme } from './utils/theme';
import './index.scss';
import App from './App.jsx';

applyTheme(getInitialTheme());

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
