import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTable from '../../../../../Shared/DataTable';
import formatDate from '../../../../../Utilities/formatDate';
import CurrentTime from '../../../../../Utilities/CurrentTime';
import DynamicModal from '../../../../../Shared/DynamicModal';
import ToastNotification from '../../../../../Shared/ToastNotification';
import { Inertia } from '@inertiajs/inertia';

const calculateJamSelesai = (jamMulai, durasi) => {
    const [hour, minute] = jamMulai.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hour, minute, 0, 0);
    startTime.setMinutes(startTime.getMinutes() + durasi); // Tambahkan durasi dalam menit

    const jamSelesai = startTime.toTimeString().slice(0, 5); // Format waktu menjadi HH:MM
    return jamSelesai;
};

const ListJadwal = () => {
    const { kelasHarian, jadwal, month, flash } = usePage().props;

    const headers = ["No.", "Tanggal", "Pengisian", "Waktu", "Status", "Actions"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJadwal, setCurrentJadwal] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleOpenModal = (jadwalId) => {
        const jadwalItem = jadwal.find((item) => item.id === jadwalId);
        if (jadwalItem) {
            setCurrentJadwal(jadwalItem); // Simpan seluruh data jadwal
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentJadwal(null);
        setErrors({});
    };

    const handlePresensiSubmit = (formData) => {
        const dataToSend = {
            kode_unik: formData.kode_unik,
            jadwal_id: currentJadwal.id, // Tambahkan id jadwal
        };

        setIsSubmitting(true);
        Inertia.post(route('mhs.dh.abs.doPresence'), dataToSend, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsSubmitting(false);
                ToastNotification({
                    icon: 'success',
                    title: flash?.success || 'Presensi Berhasil!',
                    timer: 2000,
                });
            },
            onError: (err) => {
                setErrors(err);
                setIsSubmitting(false);
                ToastNotification({
                    icon: 'error',
                    title: 'Presensi Gagal!',
                    timer: 2000,
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    const isPresensiTime = (tanggal, jamMulai, waktuIsiAbsen) => {
        const now = new Date();
        const startDateTime = new Date(`${tanggal}T${jamMulai}`);
        const endDateTime = new Date(startDateTime);
        endDateTime.setMinutes(endDateTime.getMinutes() + waktuIsiAbsen);

        return now >= startDateTime && now <= endDateTime;
    };

    const rows = jadwal.map((item, index) => [
        index + 1,
        formatDate(item.tanggal),
        item.kelas_harian.jam_mulai.split(':').slice(0, 2).join(':') + " - " + calculateJamSelesai(item.kelas_harian.jam_mulai, parseInt(item.waktu_isi_absen)),
        item.kelas_harian.jam_mulai.split(':').slice(0, 2).join(':') + " - " + calculateJamSelesai(item.kelas_harian.jam_mulai, item.kelas_harian.durasi),
        item.absensi_harians.length > 0
            ? item.absensi_harians[0].status[0].toUpperCase() + item.absensi_harians[0].status.slice(1)
            : '-',
        (
            <div className="flex justify-center">
                {isPresensiTime(item.tanggal, item.kelas_harian.jam_mulai, parseInt(item.waktu_isi_absen)) &&
                item.absensi_harians.length === 0 ? (
                    <button
                        onClick={() => handleOpenModal(item.id)}
                        className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <i className="fa fa-edit"></i> Isi Presensi
                    </button>
                ) : (
                    <span className="text-gray-500">
                        {item.absensi_harians.length > 0 ? "Sudah Mengisi" : "Sesuai Jadwal"}
                    </span>
                )}
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
                            />
                        </div>                        
                    </div>
                </div>
            </MyLayout>

            <DynamicModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={(data) => handlePresensiSubmit(data)}
                fields={[
                    {
                        name: 'kode_unik',
                        label: 'Kode Presensi',
                        type: 'text',
                        // required: true,
                    },
                ]}
                title="Isi Presensi"
                isSubmitting={isSubmitting}
                errors={errors}
                tbutton="Submit"
                tProses="Submiting..."
                colorButton="blue"
            />
        </>
    );
};

export default ListJadwal;
