import React, { useEffect, useRef } from 'react';

interface ImagePopupProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ isOpen, imageUrl, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null); // Referencia al div del popup

  // Efecto para manejar el cierre con la tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Manejar el clic fuera del popup para cerrarlo
  const handleClickOutside = (event: React.MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={handleClickOutside}>
      <div className="bg-white p-4 rounded" ref={popupRef}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-700">
          X
        </button>
        <img src={imageUrl} alt="Incidencia" className="max-w-full max-h-[80vh]" />
      </div>
    </div>
  );
};

export default ImagePopup;
