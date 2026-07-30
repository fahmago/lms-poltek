import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';
import Delete from '../../../../../Shared/Delete';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import DynamicModal from '../../../../../Shared/DynamicModal'; // Import DynamicModal
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../../Shared/ToastNotification';
import DM2 from '../../../../../Shared/DM2';

const formatTanggal = (dateString, isNamaBulan = false) => {
    const date = new Date(dateString);

    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayName = days[date.getDay()];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const displayMonth = isNamaBulan ? months[date.getMonth()] : month;

    if (isNamaBulan) {
        return `${dayName}, ${day} ${displayMonth} ${year} - ${hours}:${minutes}:${seconds}`;
    } else {
        return `${dayName}, ${day}-${displayMonth}-${year}`;
    }
};

// Contoh penggunaan:
// console.log(formatTanggal("2025-01-30T10:15:30", true)); // Kamis, 30 Januari 2025 - 10:15:30
// console.log(formatTanggal("2025-01-30T10:15:30"));      // Kamis, 30-01-2025


const ShowMateri = () => {
    const { kelas, materis } = usePage().props;

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalFields, setModalFields] = useState([]);
    const [selectedMateri, setSelectedMateri] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalErrors, setModalErrors] = useState({});

    const headers = ["No.", "Tanggal", "Materi", "Deskripsi", "Link Modul", "Actions"];

    const rows = materis.data.map((materi, index) => [
        index + 1 + (materis.current_page - 1) * materis.per_page,
        // materi.tanggal_dibuat,
        formatTanggal(materi.tanggal_dibuat),
        <div
            className='text-left'
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: materi.judul }}></div>,
        <div 
            className='text-left'
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: materi.deskripsi }}></div>,
        <>
            {materi.file ? (
                <a
                    href={materi.file}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800">
                    <i className="fa fa-link"></i>
                </a>
            ) : (
                <span
                    className="text-red-600 cursor-not-allowed"
                    title="Link tidak tersedia">
                    <i className="fa fa-link"></i>
                </span>
            )}
        </>,
        (
            <div className="flex justify-center">
                {hasAnyPermission(['dsn.dh.mtr.edit', 'dsn.dh.mtr.delete']) ? (
                    <>
                        {hasAnyPermission(['dsn.dh.mtr.edit']) && (
                            <button
                                onClick={() => openModal(materi)}  // Call openModal to edit materi
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                <i className="fa fa-pencil-alt"></i>
                            </button>
                        )}
                        {hasAnyPermission(['dsn.dh.mtr.delete']) && (
                            <Delete URL={'/my/d/harian/materi_harian'} id={materi.uuid} />
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    const openModal = (materi) => {
        setSelectedMateri(materi);
        setModalFields([
            {
                name: '_method',
                type: 'hidden',
                defaultValue: 'PUT',
                required: true,
            },
            {
                name: 'judul',
                label: 'Judul Materi',
                defaultValue: materi.judul || '',
                required: false,
            },
            {
                name: 'file',
                label: 'Link Modul',
                defaultValue: materi.file || '',
                required: false,
            },
            {
                name: 'deskripsi',
                label: 'Deskripsi Materi',
                defaultValue: materi.deskripsi || '',
                type: 'quill',
                required: false,
            },            
        ]);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedMateri(null);
        setModalFields([]);
        setModalErrors({}); // Reset errors saat menutup modal
    };

    const handleSubmit = (updatedData) => {
        setIsSubmitting(true);

        Inertia.post(route('dsn.dh.materi.update', { uuid: selectedMateri.uuid }), updatedData, {
            onSuccess: () => {
                setIsSubmitting(false);
                closeModal();
                ToastNotification({
                    icon: 'success',
                    title: 'Materi berhasil diupdate',
                    timer: 2000
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setModalErrors(errors);
                ToastNotification({
                    icon: 'error',
                    title: 'Materi gagal diupdate',
                    timer: 2000
                });
            }
        });
    };

    return (
        <>
            <Head title={`eLearning - Materi Kelas ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Kelas: {kelas.nama_kelas} ({kelas.kode_kelas_harian})
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_kelas_harian}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.tahun} / {kelas.semester}</td>
                                        </tr>  
                                    </tbody>
                                </table>
                            </div>

                            <DataTable
                                headers={headers}
                                rows={rows}
                                pagination={materis}
                                iconClass="fa fa-chalkboard"
                                title={`Materi Kelas ${kelas.nama_kelas}`}
                            />
                        </div>
                    </div>
                </div>
            </MyLayout>

            {/* Modal untuk Edit Materi */}
            <DM2
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                fields={modalFields}
                title="Update Materi"
                isSubmitting={isSubmitting}  // Kirim isSubmitting ke modal
                errors={modalErrors}  // Kirim error ke modal
            />
        </>
    );
};

export default ShowMateri;
