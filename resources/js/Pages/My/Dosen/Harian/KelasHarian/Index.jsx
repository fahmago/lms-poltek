import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../../Utilities/Permissions';
import Search from '../../../../../Shared/Search';
import DataTable from '../../../../../Shared/DataTable';
import DynamicModal from '../../../../../Shared/DynamicModal';
import { Inertia } from '@inertiajs/inertia';
import ToastNotification from '../../../../../Shared/ToastNotification';
import FilterTahunSemester from '../../../../../Shared/FilterTahunSemester';

const Index = () => {
    const { kelas, availableYears, filters} = usePage().props;

    // --- PERBAIKAN DI SINI ---
    // Panggil permission di TOP LEVEL component, jangan di dalam loop map()
    // Ini memastikan Hooks dipanggil dengan urutan dan jumlah yang sama setiap render
    const canEdit   = hasAnyPermission(['dsn.dh.kelas.edit']);
    const canShow   = hasAnyPermission(['dsn.dh.kelas.show']);
    const canEnroll = hasAnyPermission(['dsn.dh.kelas.enroll']);
    // Cek apakah punya salah satu dari akses tersebut
    const hasAccess = canEdit || canShow || canEnroll; 
    // -------------------------

    // State Modal
    const [isModalOpen, setModalOpen] = useState(false);  // Modal untuk update kode enroll
    const [isTimeModalOpen, setTimeModalOpen] = useState(false);  // Modal untuk update jam_mulai dan durasi
    const [modalFields, setModalFields] = useState([]);
    const [timeModalFields, setTimeModalFields] = useState([]);  // Fields untuk modal waktu
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalErrors, setModalErrors] = useState({});
    const [timeModalErrors, setTimeModalErrors] = useState({});  // Errors untuk modal waktu

    const headers = ["No.", "Tahun", "Enroll", "Semester", "Kelas", "Start", "End", "Mahasiswa", "Actions"];

    // Fungsi untuk membuka modal update kode enroll
    const openEnrollModal = (kls) => {
        setSelectedKelas(kls);
        setModalFields([
            {
                name: '_method',
                type: 'hidden',
                defaultValue: 'PUT',
                required: true,
            },
            {
                name: 'kode_enroll',
                label: 'Kode Enroll',
                defaultValue: kls.kode_enroll || '',
                required: false,
            },
        ]);
        setModalOpen(true);
    };

    // Fungsi untuk membuka modal update jam_mulai dan durasi
    const openTimeModal = (kls) => {
        setSelectedKelas(kls);

        // Menghitung durasi berdasarkan perbedaan waktu
        const startTime = kls.jam_mulai.split(':');
        const endTime = kls.jam_selesai.split(':');
        const startMinutes = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
        const endMinutes = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
        const duration = endMinutes - startMinutes;

        setTimeModalFields([
            {
                name: '_method',
                type: 'hidden',
                defaultValue: 'PUT',
                required: true,
            },
            {
                name: 'jam_mulai',
                label: 'Jam Mulai',
                type: 'time',
                defaultValue: kls.jam_mulai || '',
                required: true,
            },
            {
                name: 'durasi',
                label: 'Durasi (Menit)',
                defaultValue: duration || '',
                required: true,
                type: 'number', // Durasi dalam menit
            }
        ]);
        setTimeModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setTimeModalOpen(false);
        setSelectedKelas(null);
        setModalFields([]);
        setTimeModalFields([]);
        setModalErrors({});
        setTimeModalErrors({});
    };

    const handleEnrollSubmit = (updatedData) => {
        setIsSubmitting(true);

        Inertia.post(route('dsn.dh.kelas.updateEnroll', { uuid: selectedKelas.uuid }), updatedData, {
            onSuccess: () => {
                setIsSubmitting(false);
                closeModal();
                ToastNotification({
                    icon: 'success',
                    title: 'Kode enroll berhasil diupdate',
                    timer: 2000
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setModalErrors(errors);
                ToastNotification({
                    icon: 'error',
                    title: 'Kode enroll gagal diupdate',
                    timer: 2000
                });
            }
        });
    };

    const handleTimeSubmit = (updatedData) => {
        setIsSubmitting(true);
        Inertia.post(route('dsn.dh.kelas.updateJamDur', { uuid: selectedKelas.uuid }), updatedData, {
            onSuccess: () => {
                setIsSubmitting(false);
                closeModal();
                ToastNotification({
                    icon: 'success',
                    title: 'Jam Mulai dan Durasi berhasil diupdate',
                    timer: 2000
                });
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setTimeModalErrors(errors);
                ToastNotification({
                    icon: 'error',
                    title: 'Jam Mulai dan Durasi gagal diupdate',
                    timer: 2000
                });
            }
        });
    };

    const rows = kelas.data.map((kls, index) => [
        index + 1 + (kelas.current_page - 1) * kelas.per_page,
        kls.tahun,
        kls.kode_enroll,
        kls.semester,
        kls.nama_kelas,
        kls.jam_mulai ? kls.jam_mulai.split(':').slice(0, 2).join(':') : '',
        kls.jam_selesai,
        kls.kelas_harian_mahasiswas_count,
        (
            <div className="flex justify-center">
                {hasAccess ? (
                    <>
                        {/* Gunakan variabel canEdit */}
                        {canEdit && (
                            <button onClick={() => openTimeModal(kls)} className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                <i className="fa fa-stopwatch-20"></i>
                            </button>
                        )}
                        {/* Gunakan variabel canShow */}
                        {canShow && (
                            <Link href={route('dsn.dh.kelas.show', kls.uuid)} className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <i className="fa fa-user-graduate"></i>
                            </Link>
                        )}
                        {/* Gunakan variabel canEnroll */}
                        {canEnroll && (
                            <button onClick={() => openEnrollModal(kls)} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                <i className="fa fa-fingerprint"></i>
                            </button>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )}
                {/* {hasAnyPermission(['dsn.dh.kelas.show', 'dsn.dh.kelas.enroll', 'dsn.dh.kelas.edit']) ? (
                    <>
                        {hasAnyPermission(['dsn.dh.kelas.edit']) && (
                            <button
                                onClick={() => openTimeModal(kls)}  // Tombol untuk update waktu
                                className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            >
                                <i className="fa fa-stopwatch-20"></i>
                            </button>
                        )}
                        {hasAnyPermission(['dsn.dh.kelas.show']) && (
                            <Link
                                href={route('dsn.dh.kelas.show', kls.uuid)}
                                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <i className="fa fa-user-graduate"></i>
                            </Link>
                        )}
                        {hasAnyPermission(['dsn.dh.kelas.enroll']) && (
                            <button
                                onClick={() => openEnrollModal(kls)}  // Tombol untuk update kode enroll
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                <i className="fa fa-fingerprint"></i>
                            </button>
                        )}
                    </>
                ) : (
                    <span className="text-red-500 font-semibold">Minta Akses</span>
                )} */}
            </div>
        )
    ]);

    return (
        <>
            <Head title="eLearning - Data Kelas" />
            <MyLayout>
                <div className="flex flex-col">
                    {/* <div className={`w-full flex flex-col md:flex-row gap-2 items-center justify-end`}>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/d/harian/kelas_harian'}
                                placeholder="Keyword: [Kode Kelas] [Nama Kelas]"
                             />
                        </div>
                    </div> */}
                    {/* BARIS FILTER & SEARCH */}
                    <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* 1. Panggil Komponen Filter */}
                        {/* Cukup passing availableYears, filters, dan URL tujuan */}
                        <div className="w-full md:w-2/6">
                            <FilterTahunSemester 
                                availableYears={availableYears}
                                filters={filters}
                                url={route('dsn.dh.kelas.index')} // URL Route Index ini
                            />
                        </div>

                        {/* 2. Komponen Search */}
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search 
                                URL={'/my/d/harian/kelas_harian'}
                                placeholder="Cari: [Kode] [Nama Kelas]"
                            />
                        </div>
                    </div>
                </div>
                <DataTable
                    headers={headers}
                    rows={rows}
                    pagination={kelas}
                    iconClass="fa fa-users-rectangle"
                    title="Data Kelas Harian"
                />
                {/* Modal untuk Update Kode Enroll */}
                <DynamicModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleEnrollSubmit}
                    fields={modalFields}
                    title="Update Kode Enroll"
                    isSubmitting={isSubmitting}
                    errors={modalErrors}
                />
                {/* Modal untuk Update Jam Mulai dan Durasi */}
                <DynamicModal
                    isOpen={isTimeModalOpen}
                    onClose={closeModal}
                    onSubmit={handleTimeSubmit}
                    fields={timeModalFields}
                    title="Update Jam Mulai dan Durasi"
                    isSubmitting={isSubmitting}
                    errors={timeModalErrors}
                />
            </MyLayout>
        </>
    );
};

export default Index;
