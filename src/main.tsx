import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import "./index.css"
import React from 'preact/compat';
import Router from './Router';
import { AuthProvider } from './context/AuthContext';
import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css';
import { EmailVerificationProvider } from './context/EmailVerificationContext';
import { GlobalStateProvider } from './context/GlobalStateProvider';

const rootElement = document.getElementById('app');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <Theme>
            <AuthProvider>
                <React.StrictMode>
                    <HashRouter>
                        <div className="font-sukhumvit font-medium">
                            <EmailVerificationProvider>
                                <GlobalStateProvider>
                                    <Router />
                                </GlobalStateProvider>
                            </EmailVerificationProvider>
                        </div>
                    </HashRouter>
                </React.StrictMode>
            </AuthProvider>
        </Theme>
    );
} else {
    console.error('Root element not found');
}
