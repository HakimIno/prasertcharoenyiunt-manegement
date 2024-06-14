// GLOBAL
import { useEffect, useState } from 'preact/hooks';
import { Routes, Route } from 'react-router-dom';

// ROUTES
import PublicRoute from './PublicRoute';
import PrivateRote from './PrivateRoute';

// PAGES
import Auth from '../pages/Auth';
import Main from '../pages/Main';
import Page404 from '../pages/Page404';
import liff from '@line/liff';

export default function Router() {
    const [isAuthentication, setIsAuthentication] = useState(false)
    const initLine = () => {
        liff.init({ liffId: '2005618139-mAer5ZOK', withLoginOnExternalBrowser: true }, () => {
            if (liff.isLoggedIn()) {
                setIsAuthentication(liff.isLoggedIn());
            }
        }, err => console.error(err));
    }

    useEffect(() => {
        initLine();
    }, []);


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
                index
                element={
                    <PrivateRote authenticated={isAuthentication}>
                        <Main.Eslip />
                    </PrivateRote>
                }
            />
            <Route
                path="*"
                element={
                    <PrivateRote authenticated={isAuthentication}>
                        <Page404 />
                    </PrivateRote>
                }
            />
        </Routes>
    );
}