import { jwtDecode, JwtPayload } from "jwt-decode";
import { IUsuarioAside, IUsuarioResponse, IUsuarioResponseTransformed } from "../../interface/usuarios/Usuario";
import baseUrl from "../helper";

const token = localStorage.getItem('token');
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
        data: data.data.map((usuario) => ({
            ...usuario,
            estado: usuario.estado === 1 ? true : false // Convertir estado a booleano
        }))
    };

    return transformedData;
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