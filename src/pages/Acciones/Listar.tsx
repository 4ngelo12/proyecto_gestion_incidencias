// import React from 'react';
import TableComponent from '../../components/tabla/Tabla';
import { useEffect, useState } from 'react';
import { showErrorAlert } from '../../core/services/alerts/AlertsService';
import { IAccionesResponse } from '../../core/interface/acciones/Acciones';
import { Acciones } from '../../core/class/Acciones';
import { getAcciones } from '../../core/services/acciones/AccionesService';

const ListaAcciones = () => {
    const incidenciasColumnas = Acciones;
    const [acciones, setAcciones] = useState<IAccionesResponse | null>(null);

    const getAccionesData = async () => {
        try {
            const data = await getAcciones();
            setAcciones(data);
        } catch (error) {
            showErrorAlert({ title: 'Error', text: (error as Error).message });
        }
    }

    useEffect(() => {
        getAccionesData();
    }, []);

    return (
        <div className="py-12 px-6 flex flex-col ">
            <h1 className="text-2xl font-bold mb-4 text-center">Lista de Acciones</h1>

            <TableComponent titulo='Reporte de Acciones' columns={incidenciasColumnas} data={Array.isArray(acciones?.data) ? acciones.data : []} 
                rowsPerPage={10} maxChars={15} isEditable={false} generatePdf={true}/>
        </div>
    )
}

export default ListaAcciones;