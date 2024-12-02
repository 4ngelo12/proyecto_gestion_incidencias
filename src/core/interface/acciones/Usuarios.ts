export interface IAccionesPorUsuarioResponse {
    message: string;
    status: number;
    data: AccionesPorUsuario[];
}

export interface AccionesPorUsuario {
    usuario_id: number;
    total_acciones: number;
    nombre_usuario: string;
    email: string;
}
