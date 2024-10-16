import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import ImagePopup from './ImagenPopUp';

interface Column {
  key: string;
  name: string;
}

interface TableComponentProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>[];
  rowsPerPage: number;
  maxChars?: number;
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data, rowsPerPage, maxChars = 20 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true); // Estado de carga

  // Simular la carga de datos (puedes reemplazar esto con tu lógica real)
  useEffect(() => {
    const loadData = async () => {
      // Simular un retraso de carga
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
  const renderCellContent = (colKey: string, value: any) => {
    if (colKey === 'imagen_url') {
      return (
        <button onClick={() => openPopup(value)} className="text-blue-500 hover:underline">
          Ver Imagen
        </button>
      );
    } else if (colKey === 'estado') {
      // Transformar el valor de estado de booleano a "Activo" o "Inactivo"
      return value ? 'Activo' : 'Inactivo';
    } else {
      // Para otros campos, truncar el texto si es necesario
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
                  <th key={col.key} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col.key} className="border-t px-4 py-2 text-sm text-gray-600">
                      {renderCellContent(col.key, row[col.key])}
                    </td>
                  ))}
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
