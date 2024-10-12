import { jwtDecode } from "jwt-decode";
import { IUsuarioResponse } from "../../interface/usuarios/Usuario";
import baseUrl from "../helper";

const token = localStorage.getItem('token');
const decoded = token ? jwtDecode(token) : null;

export const getUsuarios = async (): Promise<IUsuarioResponse> => {
    if (!decoded) {
        throw new Error('Token is invalid or missing');
    }
    const id: number = decoded?.sub ? Number(decoded.sub) : 0;

    const response = await fetch(`${baseUrl}/users/list/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data: IUsuarioResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};
