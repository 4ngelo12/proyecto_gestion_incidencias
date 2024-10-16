
import TableComponent from '../../components/tabla/Tabla';
import { getUsuarios as fetchUsuarios } from '../../core/services/usuarios/UsuarioService';
import { IUsuarioTransformed } from '../../core/interface/usuarios/Usuario';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import { Usuario } from '../../core/class/Usuario';

const ListaUsuarios = () => {
    // Asumiendo que 'usuarioColumnas' está bien definido en la clase Usuario
    const usuarioColumnas = Usuario;
    const [usuarios, setUsuarios] = useState<IUsuarioTransformed[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getUsuarios = async () => {
        try {
            const data = await fetchUsuarios();
            setUsuarios(data.data); // Solo almacenamos los usuarios, ya que el componente solo necesita el arreglo
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        } finally {
            setIsLoading(false); // Aseguramos que el loading se actualice
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    if (isLoading) {
        return <div>Cargando...</div>; // Manejo del estado de carga
    }

    if (!usuarios) {
        return <div>No se encontraron usuarios.</div>; // Manejo del caso cuando no hay usuarios
    }

    return (
        <div className="p-12 flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h1>
            {/* Pasamos los datos transformados a la tabla */}
            <TableComponent columns={usuarioColumnas} data={usuarios} rowsPerPage={10} />
        </div>
    );
};

export default ListaUsuarios;
