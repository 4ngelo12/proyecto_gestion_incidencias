import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import ImagePopup from './ImagenPopUp';
import { FilePenLine, FileText, Image } from 'lucide-react';
import { downloadPDF } from '../../core/services/Pdf/ReportePdfService';
import { jwtDecode } from 'jwt-decode';
interface Column {
  key: string;
  name: string;
}

interface TableComponentProps {
  titulo?: string;
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];  // Los datos de la tabla
  rowsPerPage: number;
  maxChars?: number;
  generatePdf?: boolean;
  isEditable?: boolean;
  onEdit?: (id: number, baseUrl: string) => void; // Prop para manejar la redirección de edición
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isRowEditable?: (row: Record<string, any>) => boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({
  columns,
  data,
  rowsPerPage,
  maxChars = 20,
  generatePdf = false,
  isEditable = true,
  onEdit,
  isRowEditable,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    loadData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const truncateText = (text: string) => {
    if (text.length > maxChars) {
      return text.substring(0, maxChars) + '...';
    }
    return text;
  };

  const openPopup = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedImage('');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCellContent = (colKey: string, value: any, rowIndex: number) => {
    const rowData = data[rowIndex]; // Datos de la fila actual
    const isRowEditableFn = isRowEditable ? isRowEditable(rowData) : true; // Usa la función si está definida
    const token = localStorage.getItem('token');
    const decoded = token ? jwtDecode(token) : null;

    if (!decoded) {
      throw new Error('Token is invalid or missing');
    }
    const usuarioId: number = decoded?.sub ? Number(decoded.sub) : 0;

    if (colKey === 'acciones') {
      return (
        <div className="flex justify-center items-center space-x-2">
          {rowData.imagen_url && (
            <button
              onClick={() => openPopup(rowData.imagen_url)}
              className="text-blue-500 hover:underline flex items-center"
            >
              <Image />
            </button>
          )}

          {isRowEditableFn && (
            <>
              {isEditable && (
                <button
                  onClick={() => onEdit && onEdit(rowData.id, '/acciones/editar')}
                  className="text-green-500 hover:underline"
                >
                  <FilePenLine />
                </button>
              )}
            </>
          )}

          {generatePdf && (
            <button
              onClick={() => downloadPDF(usuarioId, data[rowIndex].id)}
              className="text-cyan-500 hover:underline"
            >
              <FileText />
            </button>
          )}
        </div>
      );
    } else if (colKey === 'estado') {
      return value ? 'Activo' : 'Inactivo';
    } else {
      return typeof value === 'string' ? truncateText(value) : value;
    }
  };


  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <table className="min-w-full table-auto bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                  >
                    {col.name}
                  </th>
                ))}
                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="border-t px-4 py-2 text-sm text-gray-600"
                    >
                      {renderCellContent(col.key, row[col.key], rowIndex)}
                    </td>
                  ))}
                  <td className="border-t px-4 py-2 text-sm text-gray-600 text-center">
                    {renderCellContent('acciones', row, rowIndex)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      <ImagePopup isOpen={isPopupOpen} imageUrl={selectedImage} onClose={closePopup} />
    </div>
  );
};

export default TableComponent;
