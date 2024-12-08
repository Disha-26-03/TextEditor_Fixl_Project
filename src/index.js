import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css'; // Make sure this file is included for the styles
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
