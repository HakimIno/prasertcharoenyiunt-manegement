// GLOBAL
import { Routes, Route, Navigate } from 'react-router-dom';

// ROUTES

// PAGES
import Auth from '../pages/Auth';
import Main from '../pages/Main';

import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import MainLayout from '../pages/Main/Layout';
import VerifyEmail from '../components/VerifyEmail';
import Support from '../pages/Support';
import Page404 from '../pages/Page404';
import PrivacyPolicy from '../pages/PrivacyPolicy';

export default function Router() {
    const { user, } = useAuth();
    const isAuthentication = !!user;
    // && (role === "superadmin" || role === "admin")

    return (
        <Routes>
            <Route path="/" element={<Navigate to="login" />} />
            <Route
                path="login"
                element={
                    <PublicRoute authenticated={isAuthentication}>
                        <Auth.Login />
                    </PublicRoute>
                }
            />
            {/* เส้นทางสำหรับ VerifyEmail */}
            <Route
                path="verify-email"
                element={
                    <PublicRoute authenticated={isAuthentication}>
                        <VerifyEmail />
                    </PublicRoute>
                }
            />
            <Route
                element={
                    <PrivateRoute authenticated={isAuthentication}>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route
                    index
                    element={<Main.Folders />}
                />
                <Route
                    path="users"
                    element={<Main.Users />}
                />
                <Route
                    path="folders"
                    element={<Main.Folders />}
                />
            </Route>
            <Route
                path="*"
                element={
                    <Page404 />
                }
            />
            <Route
                path="/support"
                element={
                    <Support />
                }
            />
            <Route
                path="/privacypolicy"
                element={
                    <PrivacyPolicy />
                }
            />
        </Routes>
    );
}