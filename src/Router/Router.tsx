// GLOBAL
import { Routes, Route } from 'react-router-dom';

// ROUTES
import PublicRoute from './PublicRoute';

// PAGES
import Auth from '../pages/Auth';
import Main from '../pages/Main';
import Page404 from '../pages/Page404';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import MainLayout from '../pages/Main/Layout';

export default function Router() {
    const { user, role } = useAuth();
    const isAuthentication = !!user && (role === "superadmin" || role === "admin");

    return (
        <Routes>
            <Route
                path="login"
                element={
                    <PublicRoute authenticated={isAuthentication}>
                        <Auth.Login />
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
                    element={<Main.Dashboard />}
                />
                <Route
                    path="users"
                    element={<Main.Users />}
                />
                <Route
                    path="folders"
                    element={<Main.Users />}
                />
            </Route>
            <Route
                path="*"
                element={
                    <PrivateRoute authenticated={isAuthentication}>
                        <Page404 />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}