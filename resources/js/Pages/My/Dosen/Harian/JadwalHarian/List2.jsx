import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';
import formatDate from '../../../../../Utilities/formatDate';
import CurrentTime from '../../../../../Utilities/CurrentTime';
import DynamicModal from '../../../../../Shared/DynamicModal'; // Pastikan path-nya sesuai
import ToastNotification from '../../../../../Shared/ToastNotification';
import { Inertia } from '@inertiajs/inertia';
import convertMonthToIndonesian from '../../../../../Utilities/ConvertMonthToIndonesian';

const List2 = () => {
    const { kelasHarian, jadwal, month, month2, flash } = usePage().props;

    // console.log(jadwal);

    const headers = ["No.", "Tanggal", "Pengisian", "Waktu", "Actions"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJadwal, setCurrentJadwal] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleOpenModal = (jadwalId) => {
        const jadwalItem = jadwal.find((item) => item.id === jadwalId);
        if (jadwalItem) {
            setCurrentJadwal(jadwalItem);
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
        // Misalnya, menggunakan route untuk update jadwal sesuai dengan UUID atau ID
        Inertia.put(route('dsn.dh.jadwal.updateJadwal', currentJadwal.uuid), formData, {
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

    const calculateJamSelesai = (jamMulai, durasi) => {
        const [hour, minute] = jamMulai.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(hour, minute, 0, 0);
        startTime.setMinutes(startTime.getMinutes() + durasi); // Tambahkan durasi dalam menit

        const jamSelesai = startTime.toTimeString().slice(0, 5); // Format waktu menjadi HH:MM
        return jamSelesai;
    };

    const rows = jadwal.map((item, index) => [
        index + 1,
        formatDate(item.tanggal),
        item.kelas_harian.jam_mulai.split(':').slice(0, 2).join(':') + " - " + calculateJamSelesai(item.kelas_harian.jam_mulai, parseInt(item.waktu_isi_absen)),
        item.kelas_harian.jam_mulai.split(':').slice(0, 2).join(':') + " - " + calculateJamSelesai(item.kelas_harian.jam_mulai, item.kelas_harian.durasi),
        (
            <div className="flex justify-center">
                <button
                    onClick={() => handleOpenModal(item.id)}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                    <i className="fa fa-edit"></i> Edit
                </button>
            </div>
        ),
    ]);

    return (
        <>
            <Head title={`Jadwal Bulan ${month}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md flex justify-between items-center">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-info-circle mr-2"></i> Detail Kelas: {kelasHarian.nama_kelas} ({kelasHarian.kode_kelas_harian})
                            </span>
                            <CurrentTime />
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kode Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelasHarian.kode_kelas_harian}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Kelas</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelasHarian.nama_kelas}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Tahun Semester</td>
                                            <td className="py-1 pl-3 w-3/4">: {kelasHarian.tahun} / {kelasHarian.semester}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 font-semibold pr-3 w-1/5">Rekap Absensi</td>
                                            <td className="py-1 pl-3 w-3/4">: {month}</td>
                                        </tr> 
                                    </tbody>
                                </table>
                            </div>
                            <DataTable
                                headers={headers}
                                rows={rows}
                                pagination={jadwal}
                                iconClass="fa fa-calendar-check mr-2"
                                title={`Jadwal Bulan ${month}`}
                                linkButton={
                                    <Link
                                        // href={route('dsn.dh.jadwal.absenMhs', [kelasHarian.uuid, kelasHarian.tahun, month])}
                                        href={route('dsn.dh.jadwal.absenMhs', {
                                            uuid_kelas_harian: kelasHarian.uuid,
                                            month: `${month2}`,
                                        })}
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
                        name: 'tanggal',
                        label: 'Tanggal',
                        type: 'date',
                        defaultValue: currentJadwal?.tanggal,
                        required: true,
                    },
                    {
                        name: 'waktu_isi_absen',
                        label: 'Waktu Isi Absen (Menit)',
                        type: 'number',
                        defaultValue: currentJadwal?.waktu_isi_absen,
                        required: true,
                    },
                    {
                        name: 'kode_unik',
                        label: 'Kode Presensi',
                        type: 'text',
                        defaultValue: currentJadwal?.kode_unik,
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

export default List2;
