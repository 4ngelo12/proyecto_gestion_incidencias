import Swal from 'sweetalert2';

interface AlertProps {
    title?: string;
    text: string;
}

export const showInformationAlert = ({ title = 'Información', text }: AlertProps) => {
    Swal.fire({
        title: title,
        text: text,
        icon: 'info',
        confirmButtonText: 'Aceptar',
    });
};

export const showSuccessAlert = ({ title = 'Éxito', text }: AlertProps) => {
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
