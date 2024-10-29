import Swal from 'sweetalert2';

interface AlertProps {
    title?: string;
    text?: string;
}

export const showInformationAlert = ({ title = 'Información', text }: AlertProps) => {
    Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        confirmButtonText: 'Aceptar',
    });
};

export const showSuccessAlert = ({ title = 'Proceso finalizado', text = 'Operación completada exitosamente' }: AlertProps = {}) => {
    Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        confirmButtonText: 'Aceptar',
    });
};

export const showErrorAlert = ({ title = 'Error', text }: AlertProps) => {
    Swal.fire({
        title: title,
        text: text,
        icon: 'error',
        confirmButtonText: 'Aceptar',
    });
};

export const showConfirmationAlert = async ({ title = '¿Estás seguro?',
    text = '¿Deseas continuar con esta acción?' }: AlertProps = {}) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'bg-green-600', 
            cancelButton: 'bg-red-600',
        },
    });
    return result.isConfirmed;
};