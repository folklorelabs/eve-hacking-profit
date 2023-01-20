import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index.styles.js';
import CssBaseline from '@mui/material/CssBaseline';
import App from './components/App';
import { ZkillPointsProvider } from './contexts/ZkillPoints';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ZkillPointsProvider>
      <CssBaseline />
      <App />
    </ZkillPointsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
