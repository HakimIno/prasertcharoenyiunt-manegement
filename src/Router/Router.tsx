import { Routes, Route, Navigate } from 'react-router-dom';
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
import TypeCarsPage from '../pages/Main/TypeCarsPage';
import FilesPage from '../pages/Main/FilesPage';

export default function Router() {
    const { user } = useAuth();
    const isAuthenticated = !!user;

    return (
        <Routes>
            <Route path="/" element={<Navigate to="login" />} />
            <Route
                path="login"
                element={
                    <PublicRoute authenticated={isAuthenticated}>
                        <Auth.Login />
                    </PublicRoute>
                }
            />
            <Route
                path="verify-email"
                element={
                    <PublicRoute authenticated={isAuthenticated}>
                        <VerifyEmail />
                    </PublicRoute>
                }
            />
            <Route
                element={
                    <PrivateRoute authenticated={isAuthenticated}>
                        <MainLayout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Main.Folders />} />
                <Route path="users" element={<Main.Users />} />
                <Route path="folders" element={<Main.Folders />} />
                <Route path="/branches/:branchId/typecars" element={<TypeCarsPage />} />
                <Route path="/branches/:branchId/typecars/:typeCarId/files" element={<FilesPage />} /> {/* เพิ่ม Route สำหรับ FilesPage */}
            </Route>
            <Route path="*" element={<Page404 />} />
            <Route path="/support" element={<Support />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        </Routes>
    );
}
