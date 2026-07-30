import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import ToastNotification from './ToastNotification';

const Delete = ({ URL, id, icon = 'fas fa-trash', onSuccess = null, titleSuccess = 'Berhasil hapus data!', ...props }) => {
    // Method destroy
    const destroy = async () => {
        // Show Sweet Alert for confirmation
        const result = await Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!'
        });

        if (result.isConfirmed) {
            // Proceed with deletion and handle success/error in callbacks
            Inertia.delete(`${URL}/${id}`, {
                onSuccess: () => {
                    ToastNotification({
                        icon: 'success',
                        title: 'Berhasil hapus data!',
                        timer: 2000
                    });
                    if (onSuccess) {
                        onSuccess();
                    }
                },
                onError: (error) => {
                    ToastNotification({
                        icon: 'error',
                        title: 'Gagal hapus data!',
                        timer: 2000
                    });
                }
            });
        }
    };

    return (
        <button
            onClick={destroy}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            {...props}
        >
            <i className={icon}></i>
        </button>
    );
};

export default Delete;
