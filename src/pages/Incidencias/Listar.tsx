// import React from 'react';
import TableComponent from '../../components/tabla/Tabla';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import { Incidencia } from '../../core/class/Incidencias';
import { getIncidencia } from '../../core/services/incidencias/IncidenciaService';
import { IncidenciasResponse } from '../../core/interface/incidencias/Incidencias';

const ListaIncidencias = () => {
    const incidenciasColumnas = Incidencia;
    const [incidencias, setIncidencias] = useState<IncidenciasResponse | null>(null);

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

    return (
        <div className="p-12 flex flex-col ">
            <h1 className="text-2xl font-bold mb-4 text-center">Lista de Incidencias</h1>

            <TableComponent columns={incidenciasColumnas} data={Array.isArray(incidencias?.data) ? incidencias.data : []} 
                rowsPerPage={10} maxChars={11} />
        </div>
    )
}

export default ListaIncidencias;