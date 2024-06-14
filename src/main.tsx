import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import "./index.css"
import React from 'preact/compat';
import Router from './Router';

const rootElement = document.getElementById('app');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <Router />
            </BrowserRouter>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found');
}
