export interface RolesResponse {
    message: string;
    status: number;
    data: IRoles[];
}

export interface IRoles {
    id: number;
    nombre: string;
    created_at: Date;
    updated_at: Date;
}