// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Correct import for React 18
import {App} from './App';  // No curly braces here
import './index.css';  // Import CSS styles (assuming 'index.css' is correct)

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
