import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/services/auth/AuthContext';

interface LogoutProps {
    children: ReactNode;
}

const Logout: React.FC<LogoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

    return (
        <div onClick={handleLogout}>
            {children} {/* Renderiza el contenido pasado como children */}
        </div>
    );
};

export default Logout;
