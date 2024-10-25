import React, { useState, useEffect, useCallback } from 'react';
import './styles/RegistrarIncidencias.scss'
import { getCategorias } from '../../core/services/incidencias/CategoriaService';
import { ICategoriaResponse } from '../../core/interface/categorias/Categotia';
import { showErrorAlert, showSuccessAlert } from '../../core/services/alerts/AlertsService';
import { getSeveridades } from '../../core/services/incidencias/SeveridadService';
import { ISeveridadResponse } from '../../core/interface/severidad/Severidad';
import { jwtDecode } from 'jwt-decode';
import { actualizarIncidencia, getIncidenciaById } from '../../core/services/incidencias/IncidenciaService';
import { IncidenciasResponse, IUpdateIncidencias } from '../../core/interface/incidencias/Incidencias';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const EditarIncidente: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [nombre, setNombre] = useState<string>('');
    const [descripcion, setDescripcion] = useState<string>('');
    const maxChars = 350;
    const [fecha, setFecha] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estados para los datos de cada select y la carga
    const [CategoriasOptions, setCategoriasOptions] = useState<ICategoriaResponse | null>(null);
    const [loadingCategorias, setLoadingCategorias] = useState<boolean>(true);
    const [selectedCategorias, setSelectedCategorias] = useState<number>();

    const [SeveridadOptions, setSeveridadOptions] = useState<ISeveridadResponse | null>(null);
    const [loadingSeveridad, setLoadingSeveridad] = useState<boolean>(true);
    const [selectedSeveridades, setSelectedSeveridades] = useState<number>();
    const [incidenciaOption, setIncidenciaOption] = useState<IncidenciasResponse | null>(null);
    const [loadingIncidencia, setLoadingIncidencia] = useState<boolean>(true);

    const handleDescripcionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDescripcion(value);
    };

    const obtenerCategorias = async () => {
        setLoadingCategorias(true);
        try {
            const categoriasData = await getCategorias(); // Llama a tu servicio para obtener roles
            setCategoriasOptions(categoriasData); // Almacena los roles en el estado
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener las categorias', text: 'Ocurrió un error al obtener los categorias.' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoadingCategorias(false);
        }
    };

    const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategorias(Number(e.target.value)); // Actualiza el rol seleccionado
    };

    const obtenerSeveridades = async () => {
        setLoadingSeveridad(true);
        try {
            const severidadData = await getSeveridades(); // Llama a tu servicio para obtener roles
            setSeveridadOptions(severidadData); // Almacena los roles en el estado
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener las categorias', text: 'Ocurrió un error al obtener los categorias.' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoadingSeveridad(false);
        }
    };

    const handleSeveridadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSeveridades(Number(e.target.value)); // Actualiza el rol seleccionado
    };

    const obtenerIncidencia = useCallback(async () => {
        setLoadingIncidencia(true);
        try {
            if (id) {
                const severidadData = await getIncidenciaById(id);
                setIncidenciaOption(severidadData);
            }
        } catch (error) {
            showErrorAlert({ title: 'Error al obtener la incidencia', text: 'Ocurrió un error al obtener la incidencia' });
            setErrors({ username: error instanceof Error ? error.message : 'Error desconocido' });
        } finally {
            setLoadingIncidencia(false);
        }
    }, [id]);

    useEffect(() => {
        if (incidenciaOption?.data?.nombre) {
            setNombre(incidenciaOption.data.nombre);
        }

        if (incidenciaOption?.data?.descripcion) {
            setDescripcion(incidenciaOption.data.descripcion);
        }

        if (incidenciaOption?.data?.fecha_reporte) {
            setFecha(new Date(incidenciaOption.data.fecha_reporte).toISOString().split('T')[0]);
        }

        if (incidenciaOption?.data?.categoria_id) {
            setSelectedCategorias(Number(incidenciaOption.data.categoria_id));
        }

        if (incidenciaOption?.data?.severidad_id) {
            setSelectedSeveridades(Number(incidenciaOption.data.severidad_id));
        }


    }, [incidenciaOption?.data?.nombre, incidenciaOption?.data?.descripcion, incidenciaOption?.data?.imagen,
    incidenciaOption?.data?.fecha_reporte, incidenciaOption?.data?.categoria_id, incidenciaOption?.data?.severidad_id]);

    useEffect(() => {
        const fetchData = async () => {
            await obtenerCategorias();
            await obtenerSeveridades();
            await obtenerIncidencia();
        };
        fetchData();
    }, [obtenerIncidencia]);

    // Función para manejar la validación del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nuevosErrores: Record<string, string> = {};

        // Validación del campo nombre
        if (nombre.length < 5) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 5 caracteres.';
        }

        // Validación del campo descripción
        if (descripcion.length < 10) {
            nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres.';
        }

        if (!fecha) {
            nuevosErrores.fecha = 'Debe seleccionar una fecha.';
        }

        if (!selectedCategorias) {
            nuevosErrores.select1 = 'Debe seleccionar una categoría.';
        }

        if (!selectedSeveridades) {
            nuevosErrores.select2 = 'Debe seleccionar una severidad.';
        }

        const token = localStorage.getItem('token');
        const decoded = token ? jwtDecode(token) : null;

        if (!decoded) {
            throw new Error('Token is invalid or missing');
        }

        const formulario: IUpdateIncidencias = {
            nombre: nombre,
            descripcion: descripcion,
            fecha_reporte: fecha,
            severidad_id: selectedSeveridades ?? 1,
            categoria_id: selectedCategorias ?? 1,
        };

        // Si hay errores, los mostramos
        if (Object.keys(nuevosErrores).length > 0) {
            setErrors(nuevosErrores);
        } else {
            try {
                if (id) {
                    await actualizarIncidencia(formulario, id.toString());
                    showSuccessAlert({ title: 'Incidencia Actualizada', text: 'La información se actualizó exitosamente' });
                    setErrors({});

                    navigate('/incidencias/listar');
                } else {
                    showErrorAlert({ title: 'Error', text: 'ID no válido' });
                }

            } catch (error) {
                showErrorAlert({ title: 'Error al registrar la incidencia', text: error instanceof Error ? error.message : 'Error desconocido' });
                setErrors({ general: 'Ocurrió un error al registrar la incidencia.' });
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {loadingIncidencia ? (
                <div className="flex justify-center items-center">
                    <ClipLoader size={50} color={"#123abc"} loading={loadingIncidencia} />
                </div>
            ) : (
                <div>
                    <div >
                        <h2 className="text-2xl font-bold mb-4 text-center">Actualizar Incidencia</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 max-w-xl mx-auto p-4 
                        bg-white shadow-md rounded-md">
                        <div className="mb-4 w-full">
                            <label className="block text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                className="w-full py-1 ps-3 pe-2 border border-gray-300 rounded-md focus:outline-none"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                        </div>

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
                            <label className="block text-gray-700">Fecha de Reporte</label>
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
                            <label htmlFor="categoriaSelect" className="block text-gray-700">Categoría</label>
                            <select
                                id="categoriaSelect"
                                value={selectedCategorias || ""}
                                onChange={handleCategoriaChange}
                                className="w-full py-1 ps-3 pe-2 border border-gray-300 rounded-md focus:outline-none"
                                disabled={loadingCategorias}
                            >
                                {selectedCategorias === undefined || selectedCategorias === null ? (
                                    <option value="" disabled>Seleccione una opción</option>
                                ) : null}
                                {(
                                    CategoriasOptions?.data ? CategoriasOptions?.data.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    )) : <option>Sin opciones disponibles</option>
                                )}
                            </select>
                            {errors.select1 && <p className="text-red-500 text-sm">{errors.select1}</p>}
                        </div>

                        <div className="mb-4 w-calc">
                            <label htmlFor="severidadSelect" className="block text-gray-700">Severidad</label>
                            <select
                                id="severidadSelect"
                                value={selectedSeveridades || ""}
                                onChange={handleSeveridadChange}
                                className="w-full py-1 ps-3 pe-2 border border-gray-300 rounded-md focus:outline-none"
                                disabled={loadingSeveridad}
                            >
                                {selectedSeveridades === undefined || selectedSeveridades === null ? (
                                    <option value="" disabled>Seleccione una opción</option>
                                ) : null}
                                {(
                                    SeveridadOptions?.data ? SeveridadOptions?.data.map((severidad) => (
                                        <option key={severidad.id} value={severidad.id}>
                                            {severidad.nombre}
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
            )}

        </div>
    );
};

export default EditarIncidente;
