export interface IEstadoIncidenteResponse {
    message: string;
    status: number;
    data: IEstadoIncidente[];
}

export interface IEstadoIncidente {
    id: number;
    nombre: string;
}