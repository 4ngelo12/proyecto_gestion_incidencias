export interface IUsuarioResponse {
    message: string;
    status: number;
    data: IUsuario[];
}

export interface IUsuario {
    id: number;
    nombre_usuario: string;
    email: string;
    estado: number;
    rol_id: number;
    rol_name: string;
}
