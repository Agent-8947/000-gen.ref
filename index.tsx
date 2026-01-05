
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './utils/testTranslation'; // Test translation helper
import './utils/autoTranslate'; // Auto-translate helper

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
