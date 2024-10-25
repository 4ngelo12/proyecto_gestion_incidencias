import baseUrl from "../helper";
import axios from 'axios';

const token = localStorage.getItem('token');

export const downloadPDF = async (idUsuario: number, id: number) => {
    try {
        const response = await axios.get(`${baseUrl}/reporte/${idUsuario}/incidencias/${id}/pdf`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            responseType: 'blob', // Para manejar el PDF como un archivo binario
        });

        // Crear una URL para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_incidencia_${id}.pdf`); // Nombre del archivo que se descargará
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Eliminar el link después de la descarga
    } catch (error) {
        console.error('Error al descargar el PDF', error);
    }
};