import { IRegistration, IRegistrationResponse, LoginResponse } from "../../interface/Auth";
import { IChangePasswordResponse } from "../../interface/Recovery";
import baseUrl from "../helper";

export const registerUser = async (userData: IRegistration): Promise<IRegistrationResponse> => {
    const response = await fetch(`${baseUrl}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data: IRegistrationResponse = await response.json();

    if (!response.ok) {
        throw new Error('Error en el servidor');
    }

    return data;
}

// Función para el login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};

export const changePassword = async (token: string, password: string): Promise<IChangePasswordResponse> => {
    const response = await fetch(`${baseUrl}/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
    });

    const data: IChangePasswordResponse = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
};