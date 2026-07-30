import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState, useMemo } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import DataTableJadwal from '../../../../../Shared/DataTableJadwal';
import formatDate from '../../../../../Utilities/formatDate';
import CurrentTime from '../../../../../Utilities/CurrentTime';
import DynamicModal from '../../../../../Shared/DynamicModal';
import ToastNotification from '../../../../../Shared/ToastNotification';
import { Inertia } from '@inertiajs/inertia';

const calculateJamSelesai = (jamMulai, durasi) => {
    const [hour, minute] = jamMulai.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hour, minute, 0, 0);
    startTime.setMinutes(startTime.getMinutes() + durasi);
    return startTime.toTimeString().slice(0, 5);
};

const ListJadwal = () => {
    const { kelasHarian, jadwal, month, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJadwal, setCurrentJadwal] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const headers = ["No.", "Tanggal", "Waktu Pengisian", "Waktu Kelas", "Status", "Actions"];

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

    const handlePresensiSubmit = (formData) => {
        const dataToSend = {
            kode_unik: formData.kode_unik,
            jadwal_id: currentJadwal.id,
        };
        setIsSubmitting(true);
        Inertia.post(route('mhs.dh.abs.doPresence'), dataToSend, {
            onSuccess: () => {
                handleCloseModal();
                ToastNotification({ icon: 'success', title: flash?.success || 'Presensi Berhasil!' });
            },
            onError: (err) => {
                setErrors(err);
                ToastNotification({ icon: 'error', title: 'Presensi Gagal!' });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const isPresensiTime = (tanggal, jamMulai, waktuIsiAbsen) => {
        const now = new Date();
        const startDateTime = new Date(`${tanggal}T${jamMulai}`);
        const endDateTime = new Date(startDateTime.getTime() + waktuIsiAbsen * 60000);
        return now >= startDateTime && now <= endDateTime;
    };

    const rows = useMemo(() => {
        return jadwal.map((item, index) => {
            const isActiveNow = isPresensiTime(item.tanggal, item.kelas_harian.jam_mulai, parseInt(item.waktu_isi_absen));
            
            return {
                className: isActiveNow ? 'bg-green-100 animate-pulse' : '',
                data: [
                    index + 1,
                    formatDate(item.tanggal),
                    item.kelas_harian.jam_mulai.slice(0, 5) + " - " + calculateJamSelesai(item.kelas_harian.jam_mulai, parseInt(item.waktu_isi_absen)),
                    item.kelas_harian.jam_mulai.slice(0, 5) + " - " + calculateJamSelesai(item.kelas_harian.jam_mulai, item.kelas_harian.durasi),
                    item.absensi_harians.length > 0
                        ? item.absensi_harians[0].status.charAt(0).toUpperCase() + item.absensi_harians[0].status.slice(1)
                        : '-',
                    (
                        <div className="flex justify-center">
                            {isActiveNow && item.absensi_harians.length === 0 ? (
                                <button
                                    onClick={() => handleOpenModal(item.id)}
                                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                >
                                    <i className="fa fa-edit mr-2"></i>Isi Presensi
                                </button>
                            ) : (
                                <span className="text-gray-500">
                                    {item.absensi_harians.length > 0 ? "Sudah Mengisi" : "Belum Waktunya"}
                                </span>
                            )}
                        </div>
                    ),
                ]
            };
        });
    }, [jadwal]);

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
                            <DataTableJadwal
                                headers={headers}
                                rows={rows}
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
                onSubmit={handlePresensiSubmit}
                fields={[{ name: 'kode_unik', label: 'Kode Presensi', type: 'text' }]}
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