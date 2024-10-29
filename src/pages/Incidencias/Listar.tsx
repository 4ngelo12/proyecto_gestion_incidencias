// import React from 'react';
import TableComponent from '../../components/tabla/Tabla';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import { Incidencia } from '../../core/class/Incidencias';
import { eliminarIncidencia, getIncidencia } from '../../core/services/incidencias/IncidenciaService';
import { IncidenciasResponse } from '../../core/interface/incidencias/Incidencias';
import { useNavigate } from 'react-router-dom';

const ListaIncidencias = () => {
    const incidenciasColumnas = Incidencia;
    const [incidencias, setIncidencias] = useState<IncidenciasResponse | null>(null);
    const navigate = useNavigate();

    const getIncidencias = async () => {
        try {
            const data = await getIncidencia();
            setIncidencias(data);
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        }
    }

    useEffect(() => {
        getIncidencias();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/incidencias/editar/${id}`);
    };

    return (
        <div className="p-12 flex flex-col ">
            <h1 className="text-2xl font-bold mb-4 text-center">Lista de Incidencias</h1>

            <TableComponent titulo='Reporte de Incidencias' columns={incidenciasColumnas} 
                data={Array.isArray(incidencias?.data) ? incidencias.data : []} rowsPerPage={10} 
                maxChars={11} isEditable={true} isDeleteable={(row) => row.estado_incidente_id === 1} 
                onDelete={eliminarIncidencia} onAfterDelete={getIncidencia} urlPdf='incidencia'
                generatePdf={true} onEdit={handleEdit} isRowEditable={(row) => row.estado_incidente_id === 1} />
        </div>
    )
}

export default ListaIncidencias;