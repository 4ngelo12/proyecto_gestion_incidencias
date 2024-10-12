
import { IEstadoIncidenteResponse } from "../interface/estado_incidente/EstadoIncidente";
import baseUrl from "./helper";

const token = localStorage.getItem('token');

export const getRoles = async (): Promise<IEstadoIncidenteResponse> => {
    const response = await fetch(`${baseUrl}/categorias`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: IEstadoIncidenteResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};
