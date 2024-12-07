import { Head, Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import DataTable from '../../../../Shared/DataTable';
import formatDate from '../../../../Utilities/formatDate';
import PresenceTime from '../../../../Utilities/PresenceTime';
import CurrentTime from '../../../../Utilities/CurrentTime';
import DynamicModal from '../../../../Shared/DynamicModal'; // Pastikan path-nya sesuai
import ToastNotification from '../../../../Shared/ToastNotification';

const Show = () => {
    const { kelas, jadwals, flash } = usePage().props;

    const headers = ["No.", "Tanggal", "Pengisian", "Waktu", "Actions"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJadwal, setCurrentJadwal] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleOpenModal = (jadwalId) => {
        const jadwal = jadwals.data.find((item) => item.id === jadwalId);
        if (jadwal) {
            setCurrentJadwal(jadwal);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentJadwal(null);
        setErrors({});
    };

    const handleUpdateJadwal = (formData) => {
        setIsSubmitting(true);
        Inertia.put(route('dsn.jdwl.updateJadwal', currentJadwal.uuid), formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsSubmitting(false);
                ToastNotification({
                    icon: 'success',
                    title: flash?.success || 'Update Jadwal Berhasil!',
                    timer: 2000,
                });
            },
            onError: (err) => {
                setErrors(err);
                setIsSubmitting(false);
                ToastNotification({
                    icon: 'error',
                    title: 'Update Jadwal Gagal!',
                    timer: 2000,
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const rows = jadwals.data.map((jadwal, index) => [
        index + 1 + (jadwals.current_page - 1) * jadwals.per_page,
        formatDate(jadwal.tanggal),
        PresenceTime({ tanggal: jadwal.tanggal, jamMulai: jadwal.jam_mulai }),
        `${jadwal.jam_mulai} - ${jadwal.jam_selesai}`,
        (
            <div className="flex justify-center">
                <button
                    onClick={() => handleOpenModal(jadwal.id)}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    <i className="fa fa-edit"></i> Edit
                </button>
            </div>
        ),
    ]);

    return (
        <>
            <Head title={`eLearning - Jadwal Kelas ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md flex justify-between items-center">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Kelas: {kelas.nama_kelas} ({kelas.kode_kelas})
                            </span>
                            <CurrentTime />
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.tahun} / {kelas.matkul.semester}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">SKS</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.matkul.sks}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Mata Kuliah</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelas.kode_matkul} / {kelas.matkul.nama_matkul}</td>
                                        </tr>                                      
                                    </tbody>
                                </table>
                            </div>                            
                            <DataTable
                                headers={headers}
                                rows={rows}
                                pagination={jadwals}
                                iconClass="fa fa-calendar-check mr-2"
                                title={`Jadwal Kelas ${kelas.nama_kelas}`}
                                linkButton={
                                    <Link
                                        href={route('dsn.jdwl.absenMhs', kelas.uuid)}
                                        className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                    >
                                        <i className="fa-regular fa-clipboard mr-1"></i> Absensi
                                    </Link>
                                }
                            />
                        </div>
                    </div>
                </div>
            </MyLayout>

            <DynamicModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleUpdateJadwal}
                fields={[
                    {
                        name: '_method',
                        type: 'hidden',
                        defaultValue: 'PUT',
                        required: true,
                    },
                    {
                        name: 'sks',
                        type: 'hidden',
                        defaultValue: kelas.matkul.sks,
                        required: true,
                    },
                    {
                        name: 'tanggal',
                        label: 'Tanggal',
                        type: 'date',
                        defaultValue: currentJadwal?.tanggal,
                        required: true,
                    },
                    {
                        name: 'jam_mulai',
                        label: 'Jam Mulai',
                        type: 'time',
                        defaultValue: currentJadwal?.jam_mulai,
                        required: true,
                    },
                ]}
                title="Edit Jadwal"
                isSubmitting={isSubmitting}
                errors={errors}
            />
        </>
    );
};

export default Show;
