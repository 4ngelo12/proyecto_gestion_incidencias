import { IAccionesResponse } from "../../interface/acciones/Acciones";
import { IAccionesPorUsuarioResponse } from "../../interface/acciones/Usuarios";
import baseUrl from "../helper";
import axios from 'axios';

const token = localStorage.getItem('token');

export const registrarAcciones = async (accionesData: FormData): Promise<IAccionesResponse> => {
    try {
        const response = await axios.post(`${baseUrl}/acciones`, accionesData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error en el servidor al registrar la incidencia.');
    }
};

export const getAcciones = async (): Promise<IAccionesResponse> => {
    const response = await fetch(`${baseUrl}/acciones`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: IAccionesResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};

export const getAccionesById = async (id: string): Promise<IAccionesResponse> => {
    const response = await fetch(`${baseUrl}/acciones/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: IAccionesResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};

export const getAccionesPorUsuarios = async (): Promise<IAccionesPorUsuarioResponse> => {
    const response = await fetch(`${baseUrl}/acciones/usuarios`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: IAccionesPorUsuarioResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};

export const actualizarAcciones = async (accionesData: FormData, id: string): Promise<IAccionesResponse> => {
    try {
        const response = await axios.patch(`${baseUrl}/acciones/${id}`, accionesData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error('Error en el servidor al actualizar la acción.');
    }
};
