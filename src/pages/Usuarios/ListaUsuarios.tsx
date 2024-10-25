
import TableComponent from '../../components/tabla/Tabla';
import { getUsuarios as fetchUsuarios } from '../../core/services/usuarios/UsuarioService';
import { IUsuarioResponseTransformed } from '../../core/interface/usuarios/Usuario';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import { Usuario } from '../../core/class/Usuario';
import { useNavigate } from 'react-router-dom';

const ListaUsuarios = () => {
    // Asumiendo que 'usuarioColumnas' está bien definido en la clase Usuario
    const usuarioColumnas = Usuario;
    const [usuarios, setUsuarios] = useState<IUsuarioResponseTransformed | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const getUsuarios = async () => {
        try {
            const data = await fetchUsuarios();
            setUsuarios(data); // Solo almacenamos los usuarios, ya que el componente solo necesita el arreglo
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        } finally {
            setIsLoading(false); // Aseguramos que el loading se actualice
        }
    };

    useEffect(() => {
        getUsuarios();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/usuarios/editar/${id}`);
    };

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
            <TableComponent columns={usuarioColumnas} data={Array.isArray(usuarios?.data) ? usuarios.data : []} 
            rowsPerPage={10} onEdit={handleEdit}/>
        </div>
    );
};

export default ListaUsuarios;
