import { Head, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import DataTable from '../../../../Shared/DataTable';
import hasAnyPermission from '../../../../Utilities/Permissions';
import formatDate from '../../../../Utilities/formatDate';
import PresenceModal from '../../../../Shared/Fields/PresenceModal';
import ToastNotification from '../../../../Shared/ToastNotification';
import PresenceTime from '../../../../Utilities/PresenceTime';
import CurrentTime from '../../../../Utilities/CurrentTime';

const ShowPresence = () => {
    const { kelas, jadwals, flash, auth} = usePage().props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJadwalId, setSelectedJadwalId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

    const headers = ["No.", "Tanggal", "Pengisian", "Waktu", "Status", "Actions"];

    // Fungsi untuk memeriksa apakah tombol "Isi Presensi" aktif
    const isPresensiActive = (jadwal) => {
        const currentDate = new Date();
        const jadwalDate = new Date(jadwal.tanggal);
        const jamMulai = jadwal.jam_mulai.split(':');
        const jadwalStartTime = new Date(jadwalDate.setHours(jamMulai[0], jamMulai[1], 0, 0));

        // Cek apakah tanggal saat ini sesuai dengan jadwal
        const isSameDay = currentDate.toDateString() === jadwalDate.toDateString();

        // Cek apakah waktu sekarang berada dalam 30 menit setelah jam_mulai
        const thirtyMinutesAfterStart = new Date(jadwalStartTime.getTime() + 30 * 60 * 1000);

        // Tombol aktif hanya jika tanggalnya sama dan waktu sekarang dalam 30 menit setelah jam_mulai
        return isSameDay && currentDate <= thirtyMinutesAfterStart;
    };

    const handleOpenModal = (jadwalId) => {
        setSelectedJadwalId(jadwalId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStatus(''); // Reset status when closing the modal
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
    };

    const handleSubmitPresence = () => {
        const formData = {
            kode_kelas: kelas.kode_kelas,
            jadwal_id: selectedJadwalId,
            status: selectedStatus,
        };

        setIsSubmitting(true); // Set submitting state to true

        Inertia.post(route('mhs.abs.doPresence'), formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setIsSubmitting(false); // Set submitting state to false after success
                ToastNotification({
                    icon: 'success',
                    title: flash?.success || 'Presensi berhasil!',
                    timer: 2000,
                });
            },
            onError: () => {
                setIsSubmitting(false); // Reset submitting state on error
                ToastNotification({
                    icon: 'error',
                    title: 'Terjadi kesalahan!',
                    timer: 2000,
                });
            },
        });
    };

    const rows = jadwals.data.map((jadwal, index) => {
        
        const hasAbsensi = jadwal.absensis.some(absensi => absensi.mahasiswa_id === auth.user.mahasiswa.id);
    
        return [
            index + 1 + (jadwals.current_page - 1) * jadwals.per_page,
            formatDate(jadwal.tanggal),
            PresenceTime({ tanggal: jadwal.tanggal, jamMulai: jadwal.jam_mulai }),
            `${jadwal.jam_mulai} - ${jadwal.jam_selesai}`,
            jadwal.absensis.length > 0
                ? jadwal.absensis[0].status[0].toUpperCase() + jadwal.absensis[0].status.slice(1)
                : '-',
            (
                <div className="flex justify-center">
                    {hasAnyPermission(['mhs.abs.presence']) && isPresensiActive(jadwal) && !hasAbsensi ? (
                        <button
                            onClick={() => handleOpenModal(jadwal.id)}
                            className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <i className="fa fa-edit"></i> Isi Presensi
                        </button>
                    ) : (
                        <span className="text-gray-500">Sesuai Jadwal</span>
                    )}
                </div>
            )
        ];
    });
    

    // const rows = jadwals.data.map((jadwal, index) => [
    //     index + 1 + (jadwals.current_page - 1) * jadwals.per_page,
    //     formatDate(jadwal.tanggal), 
    //     PresenceTime({ tanggal: jadwal.tanggal, jamMulai: jadwal.jam_mulai }),
    //     `${jadwal.jam_mulai} - ${jadwal.jam_selesai}`,
    //     jadwal.absensis.length > 0 
    //                             ? jadwal.absensis[0].status[0].toUpperCase() + jadwal.absensis[0].status.slice(1) 
    //                             : '-',
    //     (
    //         <div className="flex justify-center">
    //             {hasAnyPermission(['mhs.abs.presence']) && isPresensiActive(jadwal) ? (
    //                 <button
    //                     onClick={() => handleOpenModal(jadwal.id)}
    //                     className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //                 >
    //                     <i className="fa fa-edit"></i> Isi Presensi
    //                 </button>
    //             ) : (
    //                 <span className="text-gray-500">Sesuai Jadwal</span>
    //             )}
    //         </div>
    //     )
    // ]);

    return (
        <>
            <Head title={`eLearning - Jadwal Kelas ${kelas.nama_kelas}`} />
            <MyLayout>
                <div className="mt-5">
                    <div className="bg-white shadow-sm rounded-md">
                        {/* <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-check mr-2"></i> Jadwal Kelas: {kelas.nama_kelas} ({kelas.kode_kelas})
                            </span>
                        </div> */}
                        <div className="bg-blue-600 p-4 rounded-t-md flex justify-between items-center">
                            {/* Menampilkan waktu sekarang */}
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-calendar-check mr-2"></i> Jadwal Kelas: {kelas.nama_kelas} ({kelas.kode_kelas})
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
                                            <td className="py-1 font-semibold pr-3 w-1/5">Sks</td>
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
                                iconClass="fa fa-clipboard-list"
                                title={`Jadwal Kelas ${kelas.nama_kelas}`}
                            />
                        </div>
                    </div>
                </div>
                <PresenceModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitPresence}
                    selectedStatus={selectedStatus}
                    onStatusChange={handleStatusChange}
                    isSubmitting={isSubmitting} // Pass the isSubmitting state to modal
                />
            </MyLayout>
        </>
    );
};

export default ShowPresence;
