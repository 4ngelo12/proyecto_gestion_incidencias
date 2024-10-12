import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../core/services/auth/AuthService';

interface LogoutProps {
    children: ReactNode;
}

const Logout: React.FC<LogoutProps> = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser(); // Lógica para eliminar el token o limpiar la sesión
        navigate('/login'); // Redirige al login después de cerrar sesión
    };

    return (
        <div onClick={handleLogout}>
            {children} {/* Renderiza el contenido pasado como children */}
        </div>
    );
};

export default Logout;
