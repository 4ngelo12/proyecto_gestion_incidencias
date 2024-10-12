import { ISeveridadResponse } from "../interface/severidad/Severidad";
import baseUrl from "./helper";

const token = localStorage.getItem('token');

export const getRoles = async (): Promise<ISeveridadResponse> => {
    const response = await fetch(`${baseUrl}/severidad`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: ISeveridadResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};
