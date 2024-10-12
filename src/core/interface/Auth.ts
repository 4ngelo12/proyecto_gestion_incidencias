
export interface LoginResponse {
    status: number;
    message: string;
    token: string;
}

export interface IRegistration {
    nombre_usuario: string;
    email: string;
    password: string;
    rol_id: number;
}

export interface IRegistrationResponse {
    status: number;
    data: Data;
}

export interface Data {
    nombre_usuario: string;
    email: string;
    rol_id: number;
    id: number;
    rol_name: string;
}
