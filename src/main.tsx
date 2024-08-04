import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import "./index.css"
import React from 'preact/compat';
import Router from './Router';
import { AuthProvider } from './context/AuthContext';
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css';
const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <AuthProvider>
            <Theme >
                <React.StrictMode>
                    <BrowserRouter>
                        <Router />
                    </BrowserRouter>
                </React.StrictMode>
            </Theme>
        </AuthProvider>
    );
} else {
    console.error('Root element not found');
}
