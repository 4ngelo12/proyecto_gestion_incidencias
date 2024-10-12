import { RolesResponse } from "../interface/Rol";
import baseUrl from "./helper";

const token = localStorage.getItem('token');

export const getRoles = async (): Promise<RolesResponse> => {
    const response = await fetch(`${baseUrl}/roles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: RolesResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};
