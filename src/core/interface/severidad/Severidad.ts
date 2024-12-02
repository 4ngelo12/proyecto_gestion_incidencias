export interface ISeveridadResponse {
    message: string;
    status: number;
    data: ISeveridad[];
}

export interface ISeveridad {
    id: number;
    nombre: string;
}