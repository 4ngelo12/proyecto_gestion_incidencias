import React, { useState, useEffect } from 'react';
import { showErrorAlert, showSuccessAlert } from '../../core/services/alerts/AlertsService';
import { getIncidenciaActivo, patchIncidenciaCerrar } from '../../core/services/incidencias/IncidenciaService';
import { ICerrarIncidencia, IncidenciasResponse } from '../../core/interface/incidencias/Incidencias';
import { IUsuarioResponse } from '../../core/interface/usuarios/Usuario';
import { getUsuarioActivo } from '../../core/services/usuarios/UsuarioService';
import { registrarAcciones } from '../../core/services/acciones/AccionesService';

const RegistrarAcciones: React.FC = () => {
    const [descripcion, setDescripcion] = useState<string>('');
    const maxChars = 350;
    const [imagen, setImagen] = useState<File | null>(null);
    const [fecha, setFecha] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estados para los datos de cada select y la carga
    const [incidenciaOptions, setIncidenciaOptions] = useState<IncidenciasResponse | null>(null);
    const [loadingIncidencias, setLoadingIncidencias] = useState<boolean>(true);
    const [selectedIncidencias, setSelectedIncidencias] = useState<number>();

    const [usuarioOptions, setUsuarioOptions] = useState<IUsuarioResponse | null>(null);
    const [loadingUsuario, setLoadingUsuario] = useState<boolean>(true);
    const [selectedUsuarios, setSelectedUsuarios] = useState<number>();

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescripcion(value);
    };

    const obtenerIncidenciasActivas = async () => {
        setLoadingIncidencias(true);
        try {
            const categoriasData = await getIncidenciaActivo();
            setIncidenciaOptions(categoriasData);
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener las incidencias', text: 'Ocurrió un error al obtener los incidencias.' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoadingIncidencias(false);
        }
    };

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedIncidencias(Number(e.target.value));
    };

    const obtenerUsuariosActivos = async () => {
        setLoadingUsuario(true);
        try {
            const severidadData = await getUsuarioActivo(); // Llama a tu servicio para obtener roles
            setUsuarioOptions(severidadData); // Almacena los roles en el estado
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener los usuarios', text: 'Ocurrió un error al obtener los usuarios' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoadingUsuario(false);
        }
    };

    const handleSeveridadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUsuarios(Number(e.target.value)); // Actualiza el rol seleccionado
    };

    // Llamadas a las APIs en diferentes momentos
    useEffect(() => {
        obtenerIncidenciasActivas();
        obtenerUsuariosActivos();
    }, []);

    // Función para manejar la validación del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nuevosErrores: Record<string, string> = {};

        if (descripcion.length < 10) {
            nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres.';
        }

        // Validación del campo imagen
        if (!imagen) {
            nuevosErrores.imagen = 'Debe subir una imagen.';
        } else {
            const fileSize = imagen.size / 1024 / 1024; // Convertir a MB
            const fileType = imagen.type;

            if (fileSize > 2) {
                nuevosErrores.imagen = 'La imagen no puede superar los 2MB.';
            }

            if (!['image/png', 'image/jpeg', 'image/webp'].includes(fileType)) {
                nuevosErrores.imagen = 'La imagen debe ser formato PNG, JPG o WEBP.';
            }
        }

        if (!fecha) {
            nuevosErrores.fecha = 'Debe seleccionar una fecha.';
        }

        if (!selectedIncidencias) {
            nuevosErrores.select1 = 'Debe seleccionar una categoría.';
        }

        if (!selectedUsuarios) {
            nuevosErrores.select2 = 'Debe seleccionar una severidad.';
        }

        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('imagen', imagen as Blob); // Asegúrate de que no sea null
        formData.append('fecha_accion', fecha);
        formData.append('incidencia_id', selectedIncidencias!.toString());
        formData.append('usuario_id', selectedUsuarios!.toString());

        // Si hay errores, los mostramos
        if (Object.keys(nuevosErrores).length > 0) {
            setErrors(nuevosErrores);
        } else {
            try {
                const result = await registrarAcciones(formData);
                showSuccessAlert({ title: 'Incidencia registrada', text: 'La acción se ha registrado con éxito.' });
                setErrors({});

                setDescripcion('');
                setImagen(null);
                setFecha('');
                setSelectedIncidencias(undefined);
                setSelectedUsuarios(undefined);

                cerrarIncidencia({
                    id: Number(result.data.incidencia_id), estado_incidente_id: 2,
                    fecha_cierre: result.data?.fecha_accion
                });
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                    console.log('Error desconocido');
                }
                showErrorAlert({ title: 'Error al registrar la acción', text: error instanceof Error ? error.message : 'Error desconocido' });
                setErrors({ general: 'Ocurrió un error al registrar la acción.' });
            }
        }
    };

    const cerrarIncidencia = async (data: ICerrarIncidencia) => {
        try {
            await patchIncidenciaCerrar(data);
            showSuccessAlert({ title: 'Incidencia cerrada', text: 'La incidencia se ha cerrado con éxito.' });
        } catch (error) {
            showErrorAlert({ title: 'Error al cerrar la incidencia', text: error instanceof Error ? error.message : 'Error desconocido' });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div >
                <h2 className="text-2xl font-bold mb-4 text-center">Registrar Acciones</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 max-w-xl mx-auto p-4 bg-white shadow-md rounded-md">
                <div className="mb-4 w-full">
                    <label className="block text-gray-700">Descripción</label>
                    <textarea
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        className={`w-full p-2 border rounded-md focus:outline-none
                        ${descripcion.length >= maxChars ? 'border-red-500' : 'border-gray-300'}`}
                        maxLength={maxChars}
                        rows={4}
                    />

                    <p className={`text-sm ${descripcion.length >= maxChars ? 'text-red-500' : 'text-gray-600'}`}>
                        {descripcion.length}/{maxChars}
                    </p>

                    {errors.descripcion && <p className="text-red-500 text-sm">{errors.descripcion}</p>}
                </div>

                <div className="mb-4 w-full">
                    <label className="block text-gray-700">Imagen</label>
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg,.webp"
                        onChange={(e) => setImagen(e.target.files ? e.target.files[0] : null)}
                        className="w-full py-1 border border-gray-300 rounded-md"
                    />
                    {errors.imagen && <p className="text-red-500 text-sm">{errors.imagen}</p>}
                </div>

                <div className="mb-4 w-full">
                    <label className="block text-gray-700">Fecha de Acción</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="w-full py-1 ps-3 pe-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="dd/mm/yyyy"
                    />
                    {errors.fecha && <p className="text-red-500 text-sm">{errors.fecha}</p>}
                </div>

                {/* Select 1 */}
                <div className="mb-4 w-calc">
                    <label htmlFor="categoriaSelect" className="block text-gray-700">Incidente</label>
                    <select
                        id="categoriaSelect"
                        value={selectedIncidencias || ""}
                        onChange={handleCategoriaChange}
                        className="w-full py-1 ps-3 pe-2 border border-gray-300 rounded-md focus:outline-none"
                        disabled={loadingIncidencias}
                    >
                        {selectedIncidencias === undefined || selectedIncidencias === null ? (
                            <option value="" disabled>Seleccione una opción</option>
                        ) : null}
                        {(
                            Array.isArray(incidenciaOptions?.data) ? incidenciaOptions?.data.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nombre}
                                </option>
                            )) : <option>Sin opciones disponibles</option>
                        )}
                    </select>
                    {errors.select1 && <p className="text-red-500 text-sm">{errors.select1}</p>}
                </div>

                <div className="mb-4 w-calc">
                    <label htmlFor="severidadSelect" className="block text-gray-700">Usuario</label>
                    <select
                        id="severidadSelect"
                        value={selectedUsuarios || ""}
                        onChange={handleSeveridadChange}
                        className="w-full py-1 ps-3 pe-2 border border-gray-300 rounded-md focus:outline-none"
                        disabled={loadingUsuario}
                    >
                        {selectedUsuarios === undefined || selectedUsuarios === null ? (
                            <option value="" disabled>Seleccione una opción</option>
                        ) : null}
                        {(
                            Array.isArray(usuarioOptions?.data) ? usuarioOptions?.data.map((usuario) => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.nombre_usuario}
                                </option>
                            )) : <option>Sin opciones disponibles</option>
                        )}
                    </select>
                    {errors.select2 && <p className="text-red-500 text-sm">{errors.select2}</p>}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default RegistrarAcciones;
