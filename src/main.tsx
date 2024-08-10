import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import "./index.css"
import React from 'preact/compat';
import Router from './router';
import { AuthProvider } from './context/AuthContext';
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css';


const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <Theme>
            <AuthProvider>
                <React.StrictMode>
                    <BrowserRouter>
                        <div className="font-sukhumvit font-medium">
                            <Router />
                        </div>
                    </BrowserRouter>
                </React.StrictMode>
            </AuthProvider>
        </Theme>
    );
} else {
    console.error('Root element not found');
}
