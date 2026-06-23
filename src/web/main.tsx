import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/oswald/latin-400.css';
import '@fontsource/oswald/latin-500.css';
import '@fontsource/oswald/latin-600.css';
import '@fontsource/oswald/latin-700.css';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('root element missing');

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
