import { useEffect, useState } from "react";
import PieRadius from "../../components/graficos/PieCircular";
import ColumnNomal from "../../components/graficos/Barra";
import { Data, IncidenciasResponse } from "../../core/interface/incidencias/Incidencias";
import { getIncidencia } from "../../core/services/incidencias/IncidenciaService";
import { getAccionesPorUsuarios } from "../../core/services/acciones/AccionesService";
import { AccionesPorUsuario, IAccionesPorUsuarioResponse } from "../../core/interface/acciones/Usuarios";
import { showErrorAlert } from "../../core/services/alerts/AlertsService";

const Dashboard: React.FC = () => {
    const [incidencias, setIncidencias] = useState<IncidenciasResponse | null>(null);
    const [acciones, setAcciones] = useState<IAccionesPorUsuarioResponse | null>(null);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState<string | null>(null); // Estado de error

    // Función para obtener los datos
    const fetchData = async () => {
        try {
            // Ejecutar ambas solicitudes en paralelo
            const [incidenciasData, accionesData] = await Promise.all([getIncidencia(), getAccionesPorUsuarios()]);
            setIncidencias(incidenciasData);
            setAcciones(accionesData);
        } catch (error) {
            const errorMessage = (error as Error).message;
            setError(errorMessage);
            showErrorAlert({ title: 'Error', text: errorMessage });
        } finally {
            setLoading(false); // Terminar la carga
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const contarPorCategoria = (data: Data[]) => {
        const contador = data.reduce((acc, incidente) => {
            acc[incidente.categoria_name] = (acc[incidente.categoria_name] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return Object.keys(contador).map(categoria => ({
            x: categoria,
            y: contador[categoria]
        }));
    };

    const contarPorSeveridad = (data: Data[]) => {
        const contador = data.reduce((acc, incidente) => {
            acc[incidente.severidad_name] = (acc[incidente.severidad_name] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return Object.keys(contador).map(severidad => ({
            name: severidad,
            dataSource: [{ x: severidad, y: contador[severidad] }]
        }));
    };

    const contarPorEstadoIncidente = (data: Data[]) => {
        const contador = data.reduce((acc, incidente) => {
            acc[incidente.estado_incidente_name] = (acc[incidente.estado_incidente_name] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        return Object.keys(contador).map(estadoIncidente => ({
            name: estadoIncidente,
            dataSource: [{ x: estadoIncidente, y: contador[estadoIncidente] }]
        }));
    };

    const pieChartData = incidencias && Array.isArray(incidencias.data) ? contarPorCategoria(incidencias.data) : [];
    const columnChartData = incidencias && Array.isArray(incidencias.data) ? contarPorSeveridad(incidencias.data) : [];
    const columnChartDataEstadoIncidente = incidencias && Array.isArray(incidencias.data) ? contarPorEstadoIncidente(incidencias.data) : [];

    const pieChartDataAccionesUsuario = acciones && Array.isArray(acciones.data) ? acciones.data.map((accion: AccionesPorUsuario) => ({
        x: accion.nombre_usuario,
        y: accion.total_acciones
    })) : [];

    if (loading) {
        return <p className="text-center">Cargando datos...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-8">Gráficos de Incidentes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Incidentes por Categoría */}
                {pieChartData.length > 0 ? (
                    <PieRadius
                        id="pie-1"
                        data={pieChartData}
                        title="Distribución de Incidentes por Categoría"
                        tooltipFormat="<b>${point.x}</b><br/>Cantidad: <b>${point.y}</b>"
                    />
                ) : (
                    <p>Cargando datos o no hay incidencias disponibles...</p>
                )}

                {/* Severidad por Incidentes */}
                {columnChartData.length > 0 ? (
                    <div className="w-full">
                        <ColumnNomal
                            key="column-1"
                            title="Incidentes por Severidad"
                            xAxisTitle="Severidad"
                            yAxisTitle="Número de Incidentes"
                            seriesData={columnChartData}
                        />
                    </div>
                ) : (
                    <p className="text-center">Cargando datos o no hay incidencias disponibles...</p>
                )}

                {/* Estado de Incidentes */}
                {columnChartDataEstadoIncidente.length > 0 ? (
                    <div className="w-full">
                        <ColumnNomal
                            key="column-2"
                            title="Estado de Incidentes"
                            xAxisTitle="Estado"
                            yAxisTitle="Número de Incidentes"
                            seriesData={columnChartDataEstadoIncidente}
                        />
                    </div>
                ) : (
                    <p className="text-center">Cargando datos o no hay incidencias disponibles...</p>
                )}

                {/* Acciones por Usuarios */}
                {pieChartDataAccionesUsuario.length > 0 ? (
                    <PieRadius
                        id="pie-2"
                        data={pieChartDataAccionesUsuario}
                        title="Distribución de Acciones por Usuario"
                        tooltipFormat="<b>${point.x}</b><br/>Cantidad: <b>${point.y}</b>"
                    />
                ) : (
                    <p className="text-center">Cargando datos o no hay acciones disponibles...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
