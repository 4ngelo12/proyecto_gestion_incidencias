import React, { useState } from 'react';
import { showErrorAlert, showSuccessAlert } from '../../core/services/alerts/AlertsService';
import { changePassword } from '../../core/services/auth/AuthService';
import { useNavigate, useParams } from 'react-router-dom';

interface FormData {
    password: string;
    confirmPassword: string;
}

interface Errors {
    password?: string;
    confirmPassword?: string;
}

const ActualizarPassword: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: '',
    });

    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<Errors>({});
    const [loading, setLoading] = useState<boolean>(false);


    const validate = (): boolean => {
        const newErrors: Errors = {};

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

        if (errors[name as keyof Errors]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validate()) {
            try {
                const response = await changePassword(token!, formData.password);
                setLoading(true);

                if (response.status === 200) {
                    showSuccessAlert({ title: 'Contraseña Actualizada', text: 'Su contraseña se ha actualizado correctamente' });
                    setFormData({ password: '', confirmPassword: '' });
                    navigate('/');
                } else {
                    showErrorAlert({ title: 'Error al cambiar la contraseña', text: 'No se pudo actualizar la contraseña' });
                }
            } catch (error) {
                showErrorAlert({ title: 'Error al cambiar la contraseña', text: error instanceof Error ? error.message : 'Error desconocido' });
            } finally {
                setLoading(false);
            }
        } else {
            showErrorAlert({ title: 'Error en la validación', text: 'Por favor, corrige los errores antes de enviar el formulario.' });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div >
                <h2 className="text-2xl font-bold mb-4 text-center">Cambiar Contraseña</h2>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md border-black"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

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

                <div className="flex items-center justify-between mt-4">
                    <button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 
                        focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                        ) : (
                            'Cambiar Contraseña'
                        )}

                    </button>
                </div>
            </form>
        </div>
    );
};

export default ActualizarPassword;
