import React, { useCallback, useEffect, useState } from 'react';
import { getRoles as fetchRoles } from '../../core/services/usuarios/RolService';
import { RolesResponse } from '../../core/interface/usuarios/Rol';
import { showErrorAlert, showSuccessAlert } from '../../core/services/alerts/AlertsService';
import { useNavigate, useParams } from 'react-router-dom';
import { actualizarUsuario, getUsuarioById } from '../../core/services/usuarios/UsuarioService';
import { IEditarUsuario, IUsuarioResponse } from '../../core/interface/usuarios/Usuario';
import { ClipLoader } from 'react-spinners';

interface Errors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const EditarUsuario: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [roles, setRoles] = useState<RolesResponse | null>(null);
    const [selectedRole, setSelectedRole] = useState<number>();
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(true); // Estado para la carga de roles
    const [usuarioOptions, setUsuario] = useState<IUsuarioResponse | null>(null);
    const [loadingUsuario, setLoadingUsuario] = useState<boolean>(true);


    const getRoles = async () => {
        setLoading(true);
        try {
            const rolesData = await fetchRoles(); // Llama a tu servicio para obtener roles
            setRoles(rolesData); // Almacena los roles en el estado
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener roles', text: 'Ocurrió un error al obtener los roles.' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoading(false);
        }
    };

    const obtenerUsuarioById = useCallback(async () => {
        setLoadingUsuario(true);
        try {
            if (id) {
                const severidadData = await getUsuarioById(id);
                setUsuario(severidadData);
            }
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener datos del usuario', text: 'Ocurrió un error al obtener datos del usuario' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoadingUsuario(false);
        }
    }, [id]);

    useEffect(() => {
        if (usuarioOptions?.data?.nombre_usuario) {
            setUsername(usuarioOptions.data.nombre_usuario);
        }

        if (usuarioOptions?.data?.email) {
            setEmail(usuarioOptions.data.email);
        }
    
        if (usuarioOptions?.data?.rol_id) {
            setSelectedRole(Number(usuarioOptions.data.rol_id));
        }
    }, [usuarioOptions?.data?.nombre_usuario, usuarioOptions?.data?.email, usuarioOptions?.data?.rol_id]);
    


    useEffect(() => {
        getRoles();
        obtenerUsuarioById();

    }, [obtenerUsuarioById]);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(Number(e.target.value)); // Actualiza el rol seleccionado
    };

    const validate = (): boolean => {
        const newErrors: Errors = {};
        if (username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 5 caracteres.';
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'El email es inválido.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            try {
                const formulario: IEditarUsuario = {
                    id: Number(id),
                    nombre_usuario: username,
                    email: email,
                    rol_id: selectedRole ?? 1,
                };

                if (id) {
                    await actualizarUsuario(formulario, id);
                    showSuccessAlert({ title: 'Incidencia registrada', text: 'La incidencia se ha registrado con éxito.' });
                    setErrors({});

                    setUsername('');
                    setEmail('');
                    setSelectedRole(undefined);

                    navigate('/usuarios/listar');
                } else {
                    showErrorAlert({ title: 'Error', text: 'ID no válido' });
                }
            } catch (error) {
                showErrorAlert({ title: 'Error al registrar', text: 'Ocurrió un error al registrar al usuario.' });
                setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
            }
        } else {
            showErrorAlert({ title: 'Error en la validación', text: 'Por favor, corrige los errores antes de enviar el formulario.' });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {loadingUsuario ? (
                <div className="flex justify-center items-center">
                    <ClipLoader size={50} color={"#123abc"} loading={loadingUsuario} />
                </div>
            ) : (
                <div className='w-96'>
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-center">Editar Usuario</h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md border-black"
                    >
                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleUserNameChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
                            />
                            {errors.username && <p className="text-red-500 text-xs italic mt-2">{errors.username}</p>}
                        </div>

                        <div className="mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs italic mt-2">{errors.email}</p>}
                        </div>

                        <div className="mb-2">
                            <label htmlFor="roleSelect" className="block mb-2">
                                Selecciona un rol:
                            </label>
                            <select
                                id="roleSelect"
                                value={selectedRole || ''}
                                onChange={handleRoleChange}
                                className="border w-full border-gray-300 rounded-md p-2"
                                disabled={loading}
                            >
                                <option value="" disabled>
                                    Seleccione un Rol
                                </option>
                                {loading ? (
                                    <option>Cargando...</option>
                                ) : (
                                    roles?.data ? roles?.data.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.nombre}
                                        </option>
                                    )) : <option>Sin roles disponibles</option>
                                )}
                            </select>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Registrarse
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EditarUsuario;
