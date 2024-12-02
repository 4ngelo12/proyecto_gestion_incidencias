// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../core/services/auth/AuthContext';

interface ProtectedRouteProps {
    allowedRoles: string[];
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, element }) => {
    const { role, isAuthenticated } = useAuth();

    if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
        return <Navigate to="/unauthorized" />;
    }

    return element;
};

export default ProtectedRoute;
