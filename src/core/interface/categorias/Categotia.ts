export interface ICategoriaResponse {
    message: string;
    status: number;
    data: ICategoria[];
}

export interface ICategoria {
    id: number;
    nombre: string;
}