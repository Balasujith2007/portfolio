import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LenisProvider from './components/LenisProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LenisProvider>
      <App />
    </LenisProvider>
  </React.StrictMode>
);
