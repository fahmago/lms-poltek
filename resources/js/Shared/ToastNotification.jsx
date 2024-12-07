import Swal from 'sweetalert2';

const ToastNotification = ({ icon, title, position = 'top-end', timer = 1500 }) => {
    Swal.fire({
        position,
        icon,
        title,
        showConfirmButton: false,
        timer,
        toast: true,
    });
};

export default ToastNotification;
