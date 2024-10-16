import { IncidenciasResponse } from "../../interface/incidencias/Incidencias";
import baseUrl from "../helper";
import axios from 'axios';

const token = localStorage.getItem('token');

export const registrarIncidencia = async (incidenciaData: FormData): Promise<IncidenciasResponse> => {
    try {
        const response = await axios.post(`${baseUrl}/incidencia`, incidenciaData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Importante para manejar archivos
            },
        });

        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error(error);
        throw new Error('Error en el servidor al registrar la incidencia.');
    }
};

export const getIncidencia = async (): Promise<IncidenciasResponse> => {
    const response = await fetch(`${baseUrl}/incidencia`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: IncidenciasResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};
