import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ReactElement } from 'react';

interface PrivateRouteProps {
    authenticated: boolean;
    redirect?: string;
    children: ReactElement;
}

export default function PrivateRoute({ authenticated, redirect = '/login', children }: PrivateRouteProps) {
    if (!authenticated) return <Navigate to={redirect} replace />;

    return children;
}

PrivateRoute.defaultProps = {
    redirect: '/login',
};

PrivateRoute.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    redirect: PropTypes.string,
    children: PropTypes.element.isRequired,
};
