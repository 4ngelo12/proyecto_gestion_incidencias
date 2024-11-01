// AuthContext.tsx
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    role: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (token: string) => {
        try {
            const decodedToken: { role: string } = jwtDecode(token);
            setRole(decodedToken.role);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    };

    const logout = () => {
        setRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            login(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
