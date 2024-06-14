// GLOBAL
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ReactElement } from 'preact/compat';

interface PublicRoteProps {
    authenticated: boolean;
    redirect?: string;
    children: ReactElement;
}

export default function PublicRote({ authenticated, redirect = "/", children }: PublicRoteProps) {
    if (authenticated) return <Navigate to={redirect} replace />;

    return children;
}

PublicRote.defaultProps = {
    redirect: '/',
};

PublicRote.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    redirect: PropTypes.string,
    children: PropTypes.element.isRequired,
};