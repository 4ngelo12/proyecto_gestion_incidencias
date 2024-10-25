export interface Incidencias {
    nombre: string;
    descripcion: string;
    imagen: string;
    fecha_reporte: Date;
    severidad_id: number;
    categoria_id: number;
    usuario_reporte_id: number; 
}

export interface IncidenciasResponse {
    status: number;
    message: string;
    data?: Data;
}

export interface Data {
    nombre: string;
    descripcion: string;
    imagen: string;
    fecha_reporte: Date;
    estado_incidente_id: string;
    severidad_id: string;
    categoria_id: string;
    usuario_reporte_id: string;
    id: number;
    estado_incidente_name: string;
    severidad_name: string;
    categoria_name: string;
    usuario_reporte_name: string;
}

export interface ICerrarIncidencia {
    id: number;
    estado_incidente_id: number;
    fecha_cierre: Date;
}

export interface IUpdateIncidencias {
    nombre: string;
    descripcion: string;
    fecha_reporte: string;
    severidad_id: number;
    categoria_id: number;
}
