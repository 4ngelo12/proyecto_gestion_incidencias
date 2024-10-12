import { ICategoriaResponse } from "../interface/categorias/Categotia";
import baseUrl from "./helper";

const token = localStorage.getItem('token');

export const getRoles = async (): Promise<ICategoriaResponse> => {
    const response = await fetch(`${baseUrl}/categorias`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: ICategoriaResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};
