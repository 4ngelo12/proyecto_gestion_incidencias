import { jwtDecode, JwtPayload } from "jwt-decode";
import { IEditarUsuario, IUsuarioAside, IUsuarioResponse, IUsuarioResponseTransformed } from "../../interface/usuarios/Usuario";
import baseUrl from "../helper";

const token = localStorage.getItem('token');
let isDeleting = false;

interface CustomJwtPayload extends JwtPayload {
    email?: string;
    userName?: string;
}
const decoded = token ? jwtDecode<CustomJwtPayload>(token) : null;

export const getUsuarios = async (): Promise<IUsuarioResponseTransformed> => {
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

    // Transformar 'estado' en un valor booleano en el cliente
    const transformedData: IUsuarioResponseTransformed = {
        ...data,
        data: Array.isArray(data.data) ? data.data.map((usuario) => ({
            ...usuario,
            estado: usuario.estado === 1 ? true : false // Convertir estado a booleano
        })) : []
    };

    return transformedData;
};

export const getUsuarioActivo = async (): Promise<IUsuarioResponse> => {
    const response = await fetch(`${baseUrl}/users/activo`, {
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


export const getUsuarioAside = async (): Promise<IUsuarioAside> => {
    if (!decoded) {
        throw new Error('Token is invalid or missing');
    }
    const id: number = decoded?.sub ? Number(decoded.sub) : 0;
    const email: string = decoded?.email ? decoded.email : '';
    const nombre_usuario: string = decoded?.userName ? decoded.userName : '';

    const response = {
        id,
        email,
        nombre_usuario
    };

    const data: IUsuarioAside = response;

    if (!data) {
        throw new Error('Error en el servidor');
    }

    return data;
};


export const getUsuarioById = async (id: string): Promise<IUsuarioResponse> => {
    const response = await fetch(`${baseUrl}/users/${id}`, {
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

export const actualizarUsuario = async (userData: IEditarUsuario, id: string): Promise<IUsuarioResponse> => {
    const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    const data: IUsuarioResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
    }

    return data;
};

export const eliminarUsuario = async (id: number) => {
    if (isDeleting) return;

    isDeleting = true;

    try {
        await fetch(`${baseUrl}/users/${id}`, {
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

export const reactivarUsuario = async (id: number) => {
    if (isDeleting) return;

    isDeleting = true;

    try {
        await fetch(`${baseUrl}/users/recovery/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    } finally {
        isDeleting = false;
    }
}