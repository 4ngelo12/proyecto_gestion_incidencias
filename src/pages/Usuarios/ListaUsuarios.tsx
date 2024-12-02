
import TableComponent from '../../components/tabla/Tabla';
import { eliminarUsuario, getUsuarios as fetchUsuarios, reactivarUsuario } from '../../core/services/usuarios/UsuarioService';
import { IUsuarioResponseTransformed } from '../../core/interface/usuarios/Usuario';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import { Usuario } from '../../core/class/Usuario';
import { useNavigate } from 'react-router-dom';

const ListaUsuarios = () => {
    const usuarioColumnas = Usuario;
    const [usuarios, setUsuarios] = useState<IUsuarioResponseTransformed | null>(null);
    const navigate = useNavigate();

    const getUsuarios = async () => {
        try {
            const data = await fetchUsuarios();
            setUsuarios(data);
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/usuarios/editar/${id}`);
    };

    if (!usuarios) {
        return <div>No se encontraron usuarios.</div>; // Manejo del caso cuando no hay usuarios
    }

    return (
        <div className="p-12 flex flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Lista de Usuarios</h1>

            <TableComponent columns={usuarioColumnas} data={Array.isArray(usuarios?.data) ? usuarios.data : []}
                rowsPerPage={10} onEdit={handleEdit} isDeleteable={(row) => row.estado === true}
                onDelete={eliminarUsuario} onAfterDelete={getUsuarios}
                isRecovery={(row) => row.estado === false} onRecovery={reactivarUsuario} />
        </div>
    );
};

export default ListaUsuarios;
