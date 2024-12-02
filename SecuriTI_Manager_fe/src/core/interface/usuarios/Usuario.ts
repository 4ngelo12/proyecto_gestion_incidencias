export interface IUsuarioResponse {
    message: string;
    status: number;
    data?: IUsuario;
}

export interface IUsuario {
    id: number;
    nombre_usuario: string;
    email: string;
    estado: number;
    rol_id: number;
    rol_name: string;
}

export interface IUsuarioResponseTransformed {
    message: string;
    status: number;
    data?: IUsuarioTransformed[];
}

export interface IUsuarioTransformed {
    id: number;
    nombre_usuario: string;
    email: string;
    estado: boolean; // Aquí es boolean
    rol_id: number;
    rol_name: string;
}


export interface IUsuarioAside {
    id: number;
    nombre_usuario: string;
    email: string;
}

export interface IEditarUsuario {
    id: number;
    nombre_usuario: string;
    email: string;
    password?: string;
    rol_id: number;
}