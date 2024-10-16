import React, { useState, useEffect } from 'react';
import './styles/RegistrarIncidencias.scss'
import { getCategorias } from '../../core/services/incidencias/CategoriaService';
import { ICategoriaResponse } from '../../core/interface/categorias/Categotia';
import { showErrorAlert, showSuccessAlert } from '../../core/services/alerts/AlertsService';
import { getSeveridades } from '../../core/services/incidencias/SeveridadService';
import { ISeveridadResponse } from '../../core/interface/severidad/Severidad';
import { jwtDecode } from 'jwt-decode';
import { registrarIncidencia } from '../../core/services/incidencias/IncidenciaService';

const RegistrarIncidente: React.FC = () => {
    const [nombre, setNombre] = useState<string>('');
    const [descripcion, setDescripcion] = useState<string>('');
    const maxChars = 350;
    const [imagen, setImagen] = useState<File | null>(null);
    const [fecha, setFecha] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Estados para los datos de cada select y la carga
    const [CategoriasOptions, setCategoriasOptions] = useState<ICategoriaResponse | null>(null);
    const [loadingCategorias, setLoadingCategorias] = useState<boolean>(true);
    const [selectedCategorias, setSelectedCategorias] = useState<number>();

    const [SeveridadOptions, setSeveridadOptions] = useState<ISeveridadResponse | null>(null);
    const [loadingSeveridad, setLoadingSeveridad] = useState<boolean>(true);
    const [selectedSeveridades, setSelectedSeveridades] = useState<number>();

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

    // Llamadas a las APIs en diferentes momentos
    useEffect(() => {
        obtenerCategorias();
        obtenerSeveridades();
    }, []);

    // Función para manejar la validación del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const nuevosErrores: Record<string, string> = {};

        // Validación del campo nombre
        if (nombre.length < 5) {
            nuevosErrores.nombre = 'El nombre debe tener al menos 5 caracteres.';
        }

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

        if (!selectedCategorias) {
            nuevosErrores.select1 = 'Debe seleccionar una categoría.';
        }

        if (!selectedSeveridades) {
            nuevosErrores.select2 = 'Debe seleccionar una severidad.';
        }

        console.log(selectedCategorias);
        console.log(selectedSeveridades);
        const token = localStorage.getItem('token');
        const decoded = token ? jwtDecode(token) : null;

        if (!decoded) {
            throw new Error('Token is invalid or missing');
        }
        const id: number = decoded?.sub ? Number(decoded.sub) : 0;

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('imagen', imagen as Blob); // Asegúrate de que no sea null
        formData.append('fecha_reporte', fecha);
        formData.append('categoria_id', selectedCategorias!.toString());
        formData.append('severidad_id', selectedSeveridades!.toString());
        formData.append('usuario_reporte_id', id.toString());

        // Si hay errores, los mostramos
        if (Object.keys(nuevosErrores).length > 0) {
            setErrors(nuevosErrores);
        } else {
            try {
                await registrarIncidencia(formData);
                showSuccessAlert({ title: 'Incidencia registrada', text: 'La incidencia se ha registrado con éxito.' });
                setErrors({});

                setNombre('');
                setDescripcion('');
                setImagen(null);
                setFecha('');
                setSelectedCategorias(undefined);
                setSelectedSeveridades(undefined);
            } catch (error) {
                showErrorAlert({ title: 'Error al registrar la incidencia', text: error instanceof Error ? error.message : 'Error desconocido' });
                setErrors({ general: 'Ocurrió un error al registrar la incidencia.' });
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 max-w-xl mx-auto p-4 bg-white shadow-md rounded-md">
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
    );
};

export default RegistrarIncidente;
