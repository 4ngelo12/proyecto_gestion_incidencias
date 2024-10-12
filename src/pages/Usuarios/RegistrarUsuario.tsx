import React, { useEffect, useState } from 'react';
import { getRoles as fetchRoles } from '../../core/services/RolService';
import { RolesResponse } from '../../core/interface/Rol';
import { showErrorAlert, showSuccessAlert } from '../../core/services/alerts/AlertsService';
import { registerUser } from '../../core/services/auth/AuthService';
import { IRegistration } from '../../core/interface/Auth';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

const RegistrarUsuario: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [roles, setRoles] = useState<RolesResponse | null>(null);
    const [selectedRole, setSelectedRole] = useState<number>();
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(true); // Estado para la carga de roles

    const getRoles = async () => {
        setLoading(true); // Comienza a cargar
        try {
            const rolesData = await fetchRoles(); // Llama a tu servicio para obtener roles
            setRoles(rolesData); // Almacena los roles en el estado
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener roles', text: 'Ocurrió un error al obtener los roles.' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoading(false); // Termina de cargar
        }
    };

    useEffect(() => {
        getRoles();
    }, []);

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRole(Number(e.target.value)); // Actualiza el rol seleccionado
    };

    const validate = (): boolean => {
        const newErrors: Errors = {};
        if (formData.username.length < 3) {
            newErrors.username = 'El nombre de usuario debe tener al menos 5 caracteres.';
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email es inválido.';
        }
        if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (formData.password.length < 8) {
            newErrors.confirmPassword = 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
            showErrorAlert({ title: 'Error en la validación', text: 'Las contraseñas no coinciden.' });
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Limpiar errores del campo que se está editando
        if (errors[name as keyof Errors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Previene la recarga de la página
        
        // Ejecutar la validación y solo proceder si no hay errores
        if (validate()) {
            try {
                // Aquí iría la lógica para registrar al usuario solo si la validación pasa
                const formulario: IRegistration = {
                    nombre_usuario: formData.username,
                    email: formData.email,
                    password: formData.password,
                    rol_id: selectedRole ?? 1, // Proporciona un valor por defecto
                };
    
                // Enviar la solicitud de registro
                const response = await registerUser(formulario);
                
                // Verificar si la respuesta del servidor es exitosa
                if (response.status === 201) {
                    showSuccessAlert({ title: 'Usuario registrado', text: 'El usuario ha sido registrado exitosamente.' });
                    
                    // Limpiar los campos del formulario
                    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                } else {
                    // Mostrar error en caso de que la respuesta no sea exitosa
                    showErrorAlert({ title: 'Error en el registro', text: 'No se pudo registrar al usuario.' });
                }
            } catch (error) {
                // Mostrar error en caso de que falle la solicitud
                showErrorAlert({ title: 'Error al registrar', text: 'Ocurrió un error al registrar al usuario.' });
                setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
            }
        } else {
            // Si la validación falla, puedes mostrar un mensaje genérico de error o dejar que los errores del campo se muestren.
            showErrorAlert({ title: 'Error en la validación', text: 'Por favor, corrige los errores antes de enviar el formulario.' });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Nombre de Usuario
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
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
                        value={formData.email}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs italic mt-2">{errors.email}</p>}
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <p className="text-red-500 text-xs italic mt-2">{errors.password}</p>}
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                        Repetir Contraseña
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-2">{errors.confirmPassword}</p>}
                </div>

                <div className="mb-2">
                    <label htmlFor="roleSelect" className="block mb-2">
                        Selecciona un rol:
                    </label>
                    <select
                        id="roleSelect"
                        value={selectedRole}
                        onChange={handleRoleChange}
                        className="border w-full border-gray-300 rounded-md p-2"
                        disabled={loading} // Desactiva el select mientras carga
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
    );
};

export default RegistrarUsuario;
