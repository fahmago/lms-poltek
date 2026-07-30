import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';
import Delete from '../../../../../Shared/Delete';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import DM2 from '../../../../../Shared/DM2'; // Dynamic Modal
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../../Shared/ToastNotification';
import FormatTanggal from '../../../../../Utilities/FormatTanggal';

const ShowTugasHarian = () => {
    const { kelas, tugas } = usePage().props;

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalFields, setModalFields] = useState([]);
    const [selectedTugas, setSelectedTugas] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalErrors, setModalErrors] = useState({});

    const headers = ["No.", "Kode", "Judul Tugas", "Deskripsi", "Deadline", "Actions"];

    const rows = tugas.data.map((tugasItem, index) => [
        index + 1 + (tugas.current_page - 1) * tugas.per_page,
        // tugasItem.judul,
        `TIDN${tugasItem.id}`,
        <div 
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: tugasItem.judul }}
        ></div>,
        <div 
            className="text-left" 
            style={{ maxHeight: '100px', overflowY: 'auto' }}
            dangerouslySetInnerHTML={{ __html: tugasItem.deskripsi }}
        ></div>,
        <FormatTanggal dateString={tugasItem.tanggal_deadline} />,
        (
            <div className="flex justify-center">
                <Link href={route('dsn.dh.tugas.responTugas', tugasItem.uuid)}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    {/* <i className="fa fa-eye"></i> */}
                    {tugasItem.pengumpulan_tugas_harians_count}
                </Link>
                {hasAnyPermission(['dsn.dh.tugas.edit', 'dsn.dh.tugas.delete']) ? (
                    <>
                        {hasAnyPermission(['dsn.dh.tugas.edit']) && (
                            <button
                                onClick={() => openModal(tugasItem)} // Call openModal for edit
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                <i className="fa fa-pencil-alt"></i>
                            </button>
                        )}
                        {hasAnyPermission(['dsn.dh.tugas.delete']) && (
                            <Delete URL={'/my/d/harian/tugas_harian'} id={tugasItem.uuid} />
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
            </div>
        )
    ]);

    const openModal = (tugasItem) => {
        setSelectedTugas(tugasItem);
        setModalFields([
            {
                name: '_method',
                type: 'hidden',
                defaultValue: 'PUT',
                required: true,
            },
            {
                name: 'judul',
                label: 'Judul Tugas',
                defaultValue: tugasItem.judul || '',
                required: true,
            },
            {
                name: 'tanggal_deadline',
                label: 'Tanggal Deadline',
                type: 'datetime-local',
                defaultValue: tugasItem.tanggal_deadline || '',
                required: true,
            },
            {
                name: 'deskripsi',
                label: 'Deskripsi Tugas',
                defaultValue: tugasItem.deskripsi || '',
                type: 'quill',
                required: true,
            },
        ]);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedTugas(null);
        setModalFields([]);
        setModalErrors({});
    };

    const handleSubmit = (updatedData) => {
        setIsSubmitting(true);

        Inertia.put(route('dsn.dh.tugas.update', { uuid: selectedTugas.uuid }), updatedData, {
            onSuccess: () => {
                setIsSubmitting(false);
                closeModal();
                ToastNotification({
                    icon: 'success',
                    title: 'Tugas berhasil diupdate',
                    timer: 2000
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setModalErrors(errors);
                ToastNotification({
                    icon: 'error',
                    title: 'Tugas gagal diupdate',
                    timer: 2000
                });
            }
        });
    };

    return (
        <>
            <Head title={`eLearning - Tugas Kelas ${kelas.nama_kelas}`} />
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
                                pagination={tugas}
                                iconClass="fa fa-hand-holding-hand"
                                title={`Tugas Kelas ${kelas.nama_kelas}`}
                            />
                        </div>
                    </div>
                </div>
            </MyLayout>

            {/* Modal untuk Edit Tugas */}
            <DM2
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                fields={modalFields}
                title="Update Tugas"
                isSubmitting={isSubmitting}
                errors={modalErrors}
            />
        </>
    );
};

export default ShowTugasHarian;
