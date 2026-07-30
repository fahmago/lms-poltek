import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';
import FormatTanggal from '../../../../../Utilities/FormatTanggal';
import DynamicModal from '../../../../../Shared/DynamicModal';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../../Shared/ToastNotification';
import CurrentTime from '../../../../../Utilities/CurrentTime';

const ShowTugas = () => {
    // const { kelas, tugas } = usePage().props;
    const { kelas, tugas, old, flash } = usePage().props;
    // console.log(kelas)

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTugas, setSelectedTugas] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const headers = ["No.", "Kode", "Tugas", "Deskripsi", "Deadline", "Status", "Actions"];

    const openModal = (tugasItem) => {
        setSelectedTugas(tugasItem);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedTugas(null);
        setErrors({});
    };

    const onSubmitModal = (formData) => {
        setIsSubmitting(true);
        setErrors({});

        // Kirim data ke backend menggunakan Inertia.post atau Inertia.put
        Inertia.post(route('mhs.dh.tgs.sendTugas'), { ...formData, tugas_harian_id: selectedTugas.id, kode_kelas_harian: kelas.kode_kelas_harian }, {
            onSuccess: () => {
                setIsSubmitting(false);
                setModalOpen(false);
                ToastNotification({
                    icon: 'success',
                    title: flash?.success || 'Terkirim!',
                    timer: 2000,
                });
            },
            onError: (err) => {
                setIsSubmitting(false);
                setModalOpen(false);
                setErrors(err);
                ToastNotification({
                    icon: 'error',
                    title: flash?.error || 'Gagal Terkirim!',
                    timer: 2000,
                });
            },
        });
    };

    // const rows = tugas.data.map((tugasItem, index) => [
    //     index + 1 + (tugas.current_page - 1) * tugas.per_page,
    //     `TIDN${tugasItem.id}`,
    //     <div style={{ maxHeight: '100px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: tugasItem.judul }}></div>,
    //     <div style={{ maxHeight: '100px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: tugasItem.deskripsi }}></div>,
    //     <FormatTanggal dateString={tugasItem.tanggal_deadline} />,
    //     tugasItem.pengumpulan_tugas.length > 0 ? "Terkirim" : "-",
    //     (
    //         <div className="flex justify-center">
    //             <button
    //                 onClick={() => openModal(tugasItem)}
    //                 className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //             >
    //                 <i className="fa fa-paper-plane"></i>
    //             </button>
    //         </div>
    //     )
    // ]);
    const rows = tugas.data.map((tugasItem, index) => {
        const isDeadlinePassed = new Date(tugasItem.tanggal_deadline) < new Date();
        const isSubmitted = tugasItem.pengumpulan_tugas_harians.length > 0;
    
        return [
            index + 1 + (tugas.current_page - 1) * tugas.per_page,
            `TIDN${tugasItem.id}`,
            <div style={{ maxHeight: '100px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: tugasItem.judul }}></div>,
            <div style={{ maxHeight: '100px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: tugasItem.deskripsi }}></div>,
            <FormatTanggal dateString={tugasItem.tanggal_deadline} />,
            isSubmitted ? "Terkirim" : "-",
            (
                <div className="flex justify-center">
                    {isDeadlinePassed || isSubmitted ? (
                        <span className="text-gray-500 font-semibold">
                            Sesuai Deadline
                        </span>
                    ) : (
                        <button
                            onClick={() => openModal(tugasItem)}
                            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <i className="fa fa-paper-plane"></i>
                        </button>
                    )}
                </div>
            )
        ];
    });
    

    return (
        <>
            <Head title={`eLearning - Tugas Kelas ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md flex justify-between items-center">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Kelas: {kelas.nama_kelas} ({kelas.kode_kelas_harian})
                            </span>
                            <CurrentTime/>
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

            <DynamicModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={onSubmitModal}
                title={selectedTugas ? `Kirim Tugas: TIDN${selectedTugas.id}` : "Kirim Tugas"}
                isSubmitting={isSubmitting}
                errors={errors}
                fields={[
                    // {
                    //     name: 'deskripsi',
                    //     label: 'Deskripsi',
                    //     type: 'textarea',
                    //     required: true,
                    //     defaultValue: selectedTugas.deskripsi || '',
                    // },
                    { name: 'link_tugas', label: 'Link Tugas', type: 'text', required: false, defaultValue: old?.link_tugas || '' },
                    { name: 'kendala', label: 'Kendala', type: 'textarea', required: false, defaultValue: old?.kendala || '' },
                ]}
                tbutton='Kirim'
                tProses='Sedang Mengirim...'
            />
        </>
    );
};

export default ShowTugas;
