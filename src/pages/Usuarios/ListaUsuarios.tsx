// import React from 'react';
import TableComponent from '../../components/tabla/Tabla';
import { getUsuarios as fetchUsuarios } from '../../core/services/usuarios/UsuarioService';
import { Usuario } from '../../core/class/Usuario';
import { IUsuarioResponse } from '../../core/interface/usuarios/Usuario';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';

const ListaUsuarios = () => {
    const usuarioColumnas = Usuario;
    const [usuarios, setUsuarios] = useState<IUsuarioResponse | null>(null);

    const getUsuarios = async () => {
        try {
            const data = await fetchUsuarios();
            setUsuarios(data);
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        }
    }

    useEffect(() => {
        getUsuarios();
    }, []);

    return (
        <div className="p-12 flex flex-col ">
            <h1 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h1>

            <TableComponent columns={usuarioColumnas} data={usuarios?.data || []} rowsPerPage={10} />
        </div>
    )
}

export default ListaUsuarios;