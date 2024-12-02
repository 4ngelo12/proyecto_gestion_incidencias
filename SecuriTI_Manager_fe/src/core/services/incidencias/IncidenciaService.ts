import { ICerrarIncidencia, IncidenciasResponse, IUpdateIncidencias } from "../../interface/incidencias/Incidencias";
import baseUrl from "../helper";
import axios from 'axios';

const token = localStorage.getItem('token');
let isDeleting = false;

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

export const getIncidenciaActivo = async (): Promise<IncidenciasResponse> => {
    const response = await fetch(`${baseUrl}/incidencia/activo`, {
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

export const patchIncidenciaCerrar = async (incidenciaData: ICerrarIncidencia): Promise<IncidenciasResponse> => {
    const response = await fetch(`${baseUrl}/incidencia/cerrar/${incidenciaData.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(incidenciaData),
    });

    const data: IncidenciasResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};

export const getIncidenciaById = async (id: string): Promise<IncidenciasResponse> => {
    const response = await fetch(`${baseUrl}/incidencia/${id}`, {
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

export const actualizarIncidencia = async (incidenciaData: IUpdateIncidencias, id: string): Promise<IncidenciasResponse> => {
    try {
        const response = await axios.put(`${baseUrl}/incidencia/${id}`, incidenciaData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data: IncidenciasResponse = response.data;

        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Error en el servidor al actualizar la incidencia.');
    }
};

export const eliminarIncidencia = async (id: number) => {
    if (isDeleting) return;

    isDeleting = true;

    try {
        await fetch(`${baseUrl}/incidencia/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    } finally {
        isDeleting = false;
    }
}
