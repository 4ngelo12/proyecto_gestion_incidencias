export interface IAcciones {
    descripcion: string;
    imagen: string;
    fecha_accion: number;
    estado: number;
    incidencia_id: number;
    usuario_id: number;
}

export interface IAccionesResponse {
    status: number;
    message: string;
    data: Data;
}

export interface Data {
    descripcion: string;
    imagen: string;
    fecha_accion: Date;
    incidencia_id: string;
    usuario_id: string;
    id: number;
    incidencia_name: string;
    usuario_name: string;
}
